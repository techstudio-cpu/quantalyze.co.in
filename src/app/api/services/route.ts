import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Create table if it doesn't exist (this will run on first API call)
const ensureTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        category VARCHAR(100),
        price DECIMAL(10, 2),
        show_price BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        deleted_at TIMESTAMP NULL,
        points JSON,
        sub_services JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log('Services table may already exist:', error);
  }
};

const ensureHistoryTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS services_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        snapshot JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_service_id (service_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      )
    `);
  } catch (error) {
    console.log('Services history table may already exist:', error);
  }
};

const isAdminRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  return verification.valid;
};

const logHistory = async (serviceId: number | string, action: string) => {
  const idNum = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
  if (!idNum) return;

  const rows = await query(
    `SELECT id, title, description, icon, category, price, show_price, featured, status, deleted_at, points, sub_services, created_at, updated_at
     FROM services WHERE id = ?`,
    [idNum]
  ) as any[];

  if (!Array.isArray(rows) || rows.length === 0) return;
  await query(
    'INSERT INTO services_history (service_id, action, snapshot) VALUES (?, ?, ?)',
    [idNum, action, JSON.stringify(rows[0])]
  );
};

// Check if columns exist and add them if needed
const ensureColumnsExist = async () => {
  try {
    // Check if points column exists
    const pointsCheck = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'services' 
      AND COLUMN_NAME = 'points' 
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];
    
    if (pointsCheck.length === 0) {
      await query('ALTER TABLE services ADD COLUMN points JSON');
    }
    
    // Check if sub_services column exists
    const subServicesCheck = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'services' 
      AND COLUMN_NAME = 'sub_services' 
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];
    
    if (subServicesCheck.length === 0) {
      await query('ALTER TABLE services ADD COLUMN sub_services JSON');
    }

    const showPriceCheck = await query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'services'
      AND COLUMN_NAME = 'show_price'
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];

    if (showPriceCheck.length === 0) {
      await query('ALTER TABLE services ADD COLUMN show_price BOOLEAN DEFAULT TRUE');
    }

    const deletedAtCheck = await query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'services'
      AND COLUMN_NAME = 'deleted_at'
      AND TABLE_SCHEMA = DATABASE()
    `) as any[];

    if (deletedAtCheck.length === 0) {
      await query('ALTER TABLE services ADD COLUMN deleted_at TIMESTAMP NULL');
    }
  } catch (error) {
    console.log('Column check error:', error);
  }
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
      SELECT id, title, description, icon, category, price, show_price, featured, status, deleted_at, points, sub_services, created_at, updated_at
      FROM services
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
    const services = Array.isArray(rows)
      ? rows.map((s) => ({
          ...s,
          show_price: s.show_price === undefined || s.show_price === null ? true : !!s.show_price,
        }))
      : rows;

    return NextResponse.json({
      success: true,
      services
    });

  } catch (error: any) {
    console.error('Services GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch services',
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
    
    const body = await request.json();
    const { title, description, icon, category, price, show_price, featured, points, sub_services } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO services 
      (title, description, icon, category, price, show_price, featured, status, deleted_at, points, sub_services, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NULL, ?, ?, NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      description,
      icon || null,
      category || null,
      price || null,
      show_price !== undefined ? !!show_price : true,
      featured || false,
      JSON.stringify(points || []),
      JSON.stringify(sub_services || [])
    ]) as any;

    await logHistory(result.insertId, 'create');

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      id: result.insertId
    });

  } catch (error: any) {
    console.error('Services POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create service',
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
    
    const body = await request.json();
    const { id, featured, status, title, description, icon, category, price, show_price, points, sub_services, restore } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    if (restore === true) {
      await logHistory(id, 'restore_before');
      await query('UPDATE services SET deleted_at = NULL, status = \'active\', updated_at = NOW() WHERE id = ?', [id]);
      await logHistory(id, 'restore_after');
      return NextResponse.json({ success: true, message: 'Service restored successfully' });
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

    if (icon !== undefined) {
      updateFields.push('icon = ?');
      params.push(icon);
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

    if (points !== undefined) {
      updateFields.push('points = ?');
      params.push(JSON.stringify(points));
    }

    if (sub_services !== undefined) {
      updateFields.push('sub_services = ?');
      params.push(JSON.stringify(sub_services));
    }

    updateFields.push('updated_at = NOW()');
    params.push(id);

    const updateQuery = `
      UPDATE services 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    await query(updateQuery, params);

    await logHistory(id, 'update_after');

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    });

  } catch (error: any) {
    console.error('Services PUT error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update service',
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
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    await logHistory(id, 'delete_before');
    const deleteQuery = 'UPDATE services SET deleted_at = NOW(), status = \'inactive\', updated_at = NOW() WHERE id = ?';
    await query(deleteQuery, [id]);
    await logHistory(id, 'delete_after');

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error: any) {
    console.error('Services DELETE error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete service',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
