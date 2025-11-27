import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, testFallbackConnection } from '@/lib/fallback-db';

// Check if we should use fallback (MySQL connection issues)
let useFallback = false;
let fallbackChecked = false;

async function checkFallback() {
  if (!fallbackChecked) {
    try {
      await query('SELECT 1');
      useFallback = false;
    } catch (error) {
      console.log('MySQL not available, using SQLite fallback');
      useFallback = true;
      await testFallbackConnection();
    }
    fallbackChecked = true;
  }
  return useFallback;
}

// GET /api/admin/services - Fetch all services
export async function GET() {
  try {
    await checkFallback();

    const services = useFallback
      ? await fallbackQuery(
          'SELECT * FROM services ORDER BY created_at DESC'
        )
      : await query(
          'SELECT * FROM services ORDER BY created_at DESC'
        );

    return NextResponse.json({
      success: true,
      data: services,
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch services',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    const { title, description, icon, category, price, featured = false, status = 'active' } = body;

    if (!title || !description) {
      return NextResponse.json({
        success: false,
        message: 'Title and description are required'
      }, { status: 400 });
    }

    const result = useFallback
      ? await fallbackQuery(
          `INSERT INTO services (title, description, icon, category, price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, description, icon || null, category || null, price || null, featured, status]
        )
      : await query(
          `INSERT INTO services (title, description, icon, category, price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, description, icon || null, category || null, price || null, featured, status]
        );

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: Array.isArray(result) ? result[0]?.insertId : result?.insertId,
        ...body
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create service',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// PATCH /api/admin/services - Update service
export async function PATCH(request: NextRequest) {
  try {
    await checkFallback();

    const { id, title, description, icon, category, price, featured, status } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required'
      }, { status: 400 });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (featured !== undefined) {
      updateFields.push('featured = ?');
      updateValues.push(featured);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update'
      }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const updateQuery = `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`;

    if (useFallback) {
      await fallbackQuery(updateQuery, updateValues);
    } else {
      await query(updateQuery, updateValues);
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update service',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// DELETE /api/admin/services - Delete service
export async function DELETE(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery('DELETE FROM services WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM services WHERE id = ?', [id]);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete service',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}
