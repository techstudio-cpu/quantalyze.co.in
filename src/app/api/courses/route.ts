import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Create table if it doesn't exist (this will run on first API call)
const ensureTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        show_price BOOLEAN DEFAULT TRUE,
        duration VARCHAR(50),
        level VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        deleted_at TIMESTAMP NULL,
        modules INT DEFAULT 1,
        enrolled_students INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log('Courses table may already exist:', error);
  }
};

const ensureHistoryTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS courses_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        snapshot JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_course_id (course_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      )
    `);
  } catch (error) {
    console.log('Courses history table may already exist:', error);
  }
};

const ensureColumnsExist = async () => {
  try {
    const showPriceCheck = await query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'courses'
      AND COLUMN_NAME = 'show_price'
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];

    if (showPriceCheck.length === 0) {
      await query('ALTER TABLE courses ADD COLUMN show_price BOOLEAN DEFAULT TRUE');
    }

    const deletedAtCheck = await query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'courses'
      AND COLUMN_NAME = 'deleted_at'
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];

    if (deletedAtCheck.length === 0) {
      await query('ALTER TABLE courses ADD COLUMN deleted_at TIMESTAMP NULL');
    }
  } catch (error) {
    console.log('Courses column check error:', error);
  }
};

const isAdminRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  return verification.valid;
};

const logHistory = async (courseId: number | string, action: string) => {
  const idNum = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
  if (!idNum) return;

  const rows = await query(
    `SELECT id, title, description, category, price, show_price, duration, level, featured, status, deleted_at, modules, enrolled_students, created_at, updated_at
     FROM courses WHERE id = ?`,
    [idNum]
  ) as any[];

  if (!Array.isArray(rows) || rows.length === 0) return;
  await query(
    'INSERT INTO courses_history (course_id, action, snapshot) VALUES (?, ?, ?)',
    [idNum, action, JSON.stringify(rows[0])]
  );
};

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    await ensureHistoryTableExists();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const includeDeleted = searchParams.get('includeDeleted');
    const isAdmin = isAdminRequest(request);

    let selectQuery = `
      SELECT id, title, description, category, price, show_price, duration, level, featured, status, deleted_at, modules, enrolled_students, created_at, updated_at
      FROM courses
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (!isAdmin) {
      selectQuery += " AND status = 'active' AND deleted_at IS NULL";
    } else {
      if (status && status !== 'all') {
        selectQuery += ' AND status = ?';
        params.push(status);
      }
      if (includeDeleted !== 'true') {
        selectQuery += ' AND deleted_at IS NULL';
      }
    }
    
    if (featured === 'true') {
      selectQuery += ' AND featured = TRUE';
    }
    
    if (category) {
      selectQuery += ' AND category = ?';
      params.push(category);
    }
    
    selectQuery += ' ORDER BY featured DESC, created_at DESC';

    const rows = await query(selectQuery, params) as any[];
    const courses = Array.isArray(rows)
      ? rows.map((c) => ({
          ...c,
          show_price: c.show_price === undefined || c.show_price === null ? true : !!c.show_price,
        }))
      : rows;

    return NextResponse.json({
      success: true,
      courses
    });

  } catch (error: any) {
    console.error('Courses GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch courses',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    await ensureHistoryTableExists();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, category, price, show_price, duration, level, featured, modules } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO courses 
      (title, description, category, price, show_price, duration, level, featured, status, deleted_at, modules, enrolled_students, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NULL, ?, 0, NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      description,
      category || null,
      price || null,
      show_price !== undefined ? !!show_price : true,
      duration || null,
      level || null,
      featured || false,
      modules || 1
    ]) as any;

    await logHistory(result.insertId, 'create');

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      id: result.insertId
    });

  } catch (error: any) {
    console.error('Courses POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    await ensureHistoryTableExists();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, featured, status, title, description, category, price, show_price, duration, level, modules, restore } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    if (restore === true) {
      await logHistory(id, 'restore_before');
      await query('UPDATE courses SET deleted_at = NULL, status = \'active\', updated_at = NOW() WHERE id = ?', [id]);
      await logHistory(id, 'restore_after');
      return NextResponse.json({ success: true, message: 'Course restored successfully' });
    }

    await logHistory(id, 'update_before');

    // Build dynamic update query
    const updateFields = [];
    const params = [];

    if (featured !== undefined) {
      updateFields.push('featured = ?');
      params.push(featured);
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
    }

    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }

    if (category !== undefined) {
      updateFields.push('category = ?');
      params.push(category);
    }

    if (price !== undefined) {
      updateFields.push('price = ?');
      params.push(price);
    }

    if (show_price !== undefined) {
      updateFields.push('show_price = ?');
      params.push(!!show_price);
    }

    if (duration !== undefined) {
      updateFields.push('duration = ?');
      params.push(duration);
    }

    if (level !== undefined) {
      updateFields.push('level = ?');
      params.push(level);
    }

    if (modules !== undefined) {
      updateFields.push('modules = ?');
      params.push(modules);
    }

    updateFields.push('updated_at = NOW()');
    params.push(id);

    const updateQuery = `
      UPDATE courses 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    await query(updateQuery, params);

    await logHistory(id, 'update_after');

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully'
    });

  } catch (error: any) {
    console.error('Courses PUT error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    await ensureHistoryTableExists();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    await logHistory(id, 'delete_before');
    const deleteQuery = 'UPDATE courses SET deleted_at = NOW(), status = \'inactive\', updated_at = NOW() WHERE id = ?';
    await query(deleteQuery, [id]);
    await logHistory(id, 'delete_after');

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error: any) {
    console.error('Courses DELETE error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
