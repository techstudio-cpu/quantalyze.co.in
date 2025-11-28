import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, fallbackRun, testFallbackConnection } from '@/lib/fallback-db';
import { defaultServices, mapRowToService } from '@/lib/services-data';

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

async function seedDefaultServices() {
  const insertSql = `INSERT INTO services (title, description, icon, category, price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  for (const seed of defaultServices) {
    const statusJson = JSON.stringify(seed.subServices || []);
    const params = [
      seed.name,
      seed.tagline,
      seed.icon,
      seed.href,
      seed.price || null,
      seed.order,
      statusJson,
    ];

    if (useFallback) {
      await fallbackRun(insertSql, params);
    } else {
      await query(insertSql, params);
    }
  }
}

async function fetchServiceRows() {
  const rows = useFallback
    ? await fallbackQuery('SELECT * FROM services ORDER BY created_at DESC')
    : await query('SELECT * FROM services ORDER BY created_at DESC');

  return Array.isArray(rows) ? rows : [];
}

// GET /api/admin/services - Fetch all services and map to admin UI shape
export async function GET() {
  try {
    await checkFallback();

    let servicesRows = await fetchServiceRows();

    if (servicesRows.length === 0) {
      await seedDefaultServices();
      servicesRows = await fetchServiceRows();
    }

    const services = Array.isArray(servicesRows) ? servicesRows.map(mapRowToService) : [];

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

// POST /api/admin/services - Create new service from admin UI shape
export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    const { name, tagline, icon, href, subServices, order, price } = body;

    if (!name || !tagline) {
      return NextResponse.json({
        success: false,
        message: 'Name and tagline are required'
      }, { status: 400 });
    }

    const statusJson = Array.isArray(subServices) ? JSON.stringify(subServices) : JSON.stringify([]);
    const featured = typeof order === 'number' ? order : 1;
    const category = href || '/services/';
    const title = name;
    const description = tagline;

    const insertSql = `INSERT INTO services (title, description, icon, category, price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const insertParams = [title, description, icon || null, category || null, price || null, featured, statusJson];

    if (useFallback) {
      const result = await fallbackRun(insertSql, insertParams);
      return NextResponse.json({
        success: true,
        message: 'Service created successfully',
        data: {
          ...mapRowToService({
            id: result.lastID,
            title: name,
            description: tagline,
            icon,
            category,
            price,
            featured,
            status: statusJson,
          }),
        },
        database: 'SQLite (Local)'
      });
    }

    const result = await query(insertSql, insertParams) as any;
    const insertedId = Array.isArray(result) ? result[0]?.insertId ?? result[0]?.id : result?.insertId ?? result?.id;
    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: {
        ...mapRowToService({
          id: insertedId ?? '',
          title: name,
          description: tagline,
          icon,
          category,
          price,
          featured,
          status: statusJson,
        }),
      },
      database: 'MySQL (Remote)'
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
