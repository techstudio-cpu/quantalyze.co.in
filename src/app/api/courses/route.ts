import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
        duration VARCHAR(50),
        level VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
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

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    let selectQuery = `
      SELECT id, title, description, category, price, duration, level, featured, status, modules, enrolled_students, created_at, updated_at
      FROM courses
      WHERE status = 'active'
    `;
    
    const params: any[] = [];
    
    if (featured === 'true') {
      selectQuery += ' AND featured = TRUE';
    }
    
    if (category) {
      selectQuery += ' AND category = ?';
      params.push(category);
    }
    
    selectQuery += ' ORDER BY featured DESC, created_at DESC';

    const courses = await query(selectQuery, params);

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
    
    const body = await request.json();
    const { title, description, category, price, duration, level, featured, modules } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO courses 
      (title, description, category, price, duration, level, featured, status, modules, enrolled_students, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, 0, NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      description,
      category || null,
      price || null,
      duration || null,
      level || null,
      featured || false,
      modules || 1
    ]) as any;

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
    
    const body = await request.json();
    const { id, featured, status, title, description, category, price, duration, level, modules } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

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
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Course ID is required' },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM courses WHERE id = ?';
    await query(deleteQuery, [id]);

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
