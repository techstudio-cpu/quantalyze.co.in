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

// GET /api/admin/updates - Fetch all updates
export async function GET() {
  try {
    await checkFallback();

    const updates = useFallback
      ? await fallbackQuery(
          'SELECT * FROM updates ORDER BY created_at DESC'
        )
      : await query(
          'SELECT * FROM updates ORDER BY created_at DESC'
        );

    return NextResponse.json({
      success: true,
      data: updates,
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch updates',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// POST /api/admin/updates - Create new update
export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    const { title, content, type, priority, status = 'draft' } = body;

    if (!title || !content || !type || !priority) {
      return NextResponse.json({
        success: false,
        message: 'Title, content, type, and priority are required'
      }, { status: 400 });
    }

    const result = useFallback
      ? await fallbackQuery(
          `INSERT INTO updates (title, content, type, priority, status) VALUES (?, ?, ?, ?, ?)`,
          [title, content, type, priority, status]
        )
      : await query(
          `INSERT INTO updates (title, content, type, priority, status) VALUES (?, ?, ?, ?, ?)`,
          [title, content, type, priority, status]
        );

    return NextResponse.json({
      success: true,
      message: 'Update created successfully',
      data: {
        id: Array.isArray(result) ? result[0]?.insertId : result?.insertId,
        ...body
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create update',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// PATCH /api/admin/updates - Update update
export async function PATCH(request: NextRequest) {
  try {
    await checkFallback();

    const { id, title, content, type, priority, status } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Update ID is required'
      }, { status: 400 });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
      // If publishing, set published_at
      if (status === 'published') {
        updateFields.push('published_at = CURRENT_TIMESTAMP');
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update'
      }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const updateQuery = `UPDATE updates SET ${updateFields.join(', ')} WHERE id = ?`;

    if (useFallback) {
      await fallbackQuery(updateQuery, updateValues);
    } else {
      await query(updateQuery, updateValues);
    }

    return NextResponse.json({
      success: true,
      message: 'Update updated successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update update',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// DELETE /api/admin/updates - Delete update
export async function DELETE(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Update ID is required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery('DELETE FROM updates WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM updates WHERE id = ?', [id]);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Update deleted successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete update',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}
