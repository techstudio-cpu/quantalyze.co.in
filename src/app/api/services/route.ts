import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    let selectQuery = `
      SELECT id, title, description, icon, category, price, featured, status
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
    const { title, description, icon, category, price, featured } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO services 
      (title, description, icon, category, price, featured, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      description,
      icon || null,
      category || null,
      price || null,
      featured || false
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
