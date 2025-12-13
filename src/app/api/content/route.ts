import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Create table if it doesn't exist (this will run on first API call)
const ensureTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        slug VARCHAR(255) NOT NULL UNIQUE,
        body TEXT,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log('Content table may already exist:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const section = searchParams.get('section');

    if (section) {
      // For existing functionality - return empty data since managed content system is not fully implemented
      return NextResponse.json({
        success: true,
        data: {},
        message: 'No managed content found - using defaults'
      });
    }

    let selectQuery = `
      SELECT id, title, type, category, slug, status, published_at, created_at, updated_at
      FROM content
    `;
    
    const params: any[] = [];
    
    if (type) {
      selectQuery += ' WHERE type = ?';
      params.push(type);
    }
    
    selectQuery += ' ORDER BY created_at DESC';

    const content = await query(selectQuery, params);

    return NextResponse.json({
      success: true,
      content
    });

  } catch (error: any) {
    console.error('Content GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch content',
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
    const { title, type, category, slug, content: bodyContent } = body;

    if (!title || !type || !slug) {
      return NextResponse.json(
        { success: false, message: 'Title, type, and slug are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO content 
      (title, type, category, slug, body, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'draft', NOW(), NOW())
    `;
    
    const result = await query(insertQuery, [
      title,
      type,
      category || null,
      slug,
      bodyContent || null
    ]) as any;

    return NextResponse.json({
      success: true,
      message: 'Content created successfully',
      id: result.insertId
    });

  } catch (error: any) {
    console.error('Content POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create content',
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
    const { id, status, title, type, category, slug, content: bodyContent } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updateFields = [];
    const params = [];

    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
      if (status === 'published') {
        updateFields.push('published_at = NOW()');
      }
    }

    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }

    if (type !== undefined) {
      updateFields.push('type = ?');
      params.push(type);
    }

    if (category !== undefined) {
      updateFields.push('category = ?');
      params.push(category);
    }

    if (slug !== undefined) {
      updateFields.push('slug = ?');
      params.push(slug);
    }

    if (bodyContent !== undefined) {
      updateFields.push('body = ?');
      params.push(bodyContent);
    }

    updateFields.push('updated_at = NOW()');
    params.push(id);

    const updateQuery = `
      UPDATE content 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully'
    });

  } catch (error: any) {
    console.error('Content PUT error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update content',
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
        { success: false, message: 'Content ID is required' },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM content WHERE id = ?';
    await query(deleteQuery, [id]);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error: any) {
    console.error('Content DELETE error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
