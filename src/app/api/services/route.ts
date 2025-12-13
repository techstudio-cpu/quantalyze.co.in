import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
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
  } catch (error) {
    console.log('Column check error:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    let selectQuery = `
      SELECT id, title, description, icon, category, price, featured, status, points, sub_services, created_at, updated_at
      FROM services
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

    const services = await query(selectQuery, params);

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
    
    const body = await request.json();
    const { title, description, icon, category, price, featured, points, sub_services } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO services 
      (title, description, icon, category, price, featured, status, points, sub_services, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      description,
      icon || null,
      category || null,
      price || null,
      featured || false,
      JSON.stringify(points || []),
      JSON.stringify(sub_services || [])
    ]) as any;

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
    
    const body = await request.json();
    const { id, featured, status, title, description, icon, category, price, points, sub_services } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
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
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM services WHERE id = ?';
    await query(deleteQuery, [id]);

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
