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

// GET /api/admin/inquiries - Fetch all inquiries
export async function GET(request: NextRequest) {
  try {
    await checkFallback();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params: any[] = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const inquiries = useFallback
      ? await fallbackQuery(
          `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset]
        )
      : await query(
          `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset]
        );

    const totalCountResult = useFallback
      ? await fallbackQuery(`SELECT COUNT(*) as count FROM inquiries ${whereClause}`, params)
      : await query(`SELECT COUNT(*) as count FROM inquiries ${whereClause}`, params);

    const totalCount = Array.isArray(totalCountResult) ? totalCountResult[0]?.count || 0 : 0;

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch inquiries',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// POST /api/admin/inquiries - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    const { name, email, phone, company, service, message, status = 'new' } = body;

    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and message are required'
      }, { status: 400 });
    }

    const result = useFallback
      ? await fallbackQuery(
          `INSERT INTO inquiries (name, email, phone, company, service, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, email, phone || null, company || null, service || null, message, status]
        )
      : await query(
          `INSERT INTO inquiries (name, email, phone, company, service, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, email, phone || null, company || null, service || null, message, status]
        );

    return NextResponse.json({
      success: true,
      message: 'Inquiry created successfully',
      data: {
        id: Array.isArray(result) ? result[0]?.insertId : result?.insertId,
        ...body
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create inquiry',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// PATCH /api/admin/inquiries - Update inquiry status
export async function PATCH(request: NextRequest) {
  try {
    await checkFallback();

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: 'Inquiry ID and status are required'
      }, { status: 400 });
    }

    const validStatuses = ['new', 'in-progress', 'completed', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 });
    }

    if (useFallback) {
      await fallbackQuery(
        'UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
    } else {
      await query(
        'UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry status updated successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update inquiry',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// DELETE /api/admin/inquiries - Delete inquiry
export async function DELETE(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Inquiry ID is required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery('DELETE FROM inquiries WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM inquiries WHERE id = ?', [id]);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete inquiry',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}
