import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
