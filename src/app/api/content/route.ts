import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Create table if it doesn't exist (this will run on first API call)
const ensureTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log('Content table may already exist:', error);
  }
};

const ensureManagedContentTables = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS managed_content_blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(100) NOT NULL,
        component VARCHAR(100) NOT NULL,
        field VARCHAR(100) NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_section_component_field (section, component, field),
        INDEX idx_section (section)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS managed_content_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        snapshot JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_section (section),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      )
    `);
  } catch (error) {
    console.log('Managed content tables may already exist:', error);
  }
};

const isAdminRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  return verification.valid;
};

const logManagedContentHistory = async (section: string, action: string) => {
  const rows = await query(
    'SELECT section, component, field, value FROM managed_content_blocks WHERE section = ? ORDER BY component, field',
    [section]
  ) as any[];

  await query(
    'INSERT INTO managed_content_history (section, action, snapshot) VALUES (?, ?, ?)',
    [section, action, JSON.stringify(rows || [])]
  );
};

const getManagedSectionData = async (section: string) => {
  const rows = await query(
    'SELECT component, field, value FROM managed_content_blocks WHERE section = ?',
    [section]
  ) as any[];

  const data: Record<string, Record<string, string>> = {};
  if (Array.isArray(rows)) {
    for (const r of rows) {
      const comp = String(r.component || 'default');
      const field = String(r.field || 'value');
      if (!data[comp]) data[comp] = {};
      data[comp][field] = r.value ?? '';
    }
  }
  return data;
};

const ensureSlugColumnAndIndex = async () => {
  // 1) Ensure slug column exists (nullable first to avoid backfill failures)
  const slugColumnCheck = await query(`
    SELECT COLUMN_NAME, IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'content'
      AND COLUMN_NAME = 'slug'
      AND TABLE_SCHEMA = DATABASE()
  `) as any[];

  if (slugColumnCheck.length === 0) {
    await query(`ALTER TABLE content ADD COLUMN slug VARCHAR(255) NULL`);
  }

  // 2) Backfill slug for existing rows (unique + non-empty)
  // Use id to guarantee uniqueness.
  await query(`
    UPDATE content
    SET slug = CONCAT('content-', id)
    WHERE slug IS NULL OR slug = ''
  `);

  // 3) Ensure unique index exists (without relying on column definition)
  const slugUniqueIndexCheck = await query(`
    SELECT INDEX_NAME
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_NAME = 'content'
      AND COLUMN_NAME = 'slug'
      AND NON_UNIQUE = 0
      AND TABLE_SCHEMA = DATABASE()
  `) as any[];

  if (slugUniqueIndexCheck.length === 0) {
    await query(`ALTER TABLE content ADD UNIQUE INDEX uniq_content_slug (slug)`);
  }

  // 4) Make slug NOT NULL after backfill (optional but matches API expectations)
  const slugNullable = slugColumnCheck.length > 0 ? slugColumnCheck[0]?.IS_NULLABLE === 'YES' : true;
  if (slugNullable) {
    await query(`ALTER TABLE content MODIFY COLUMN slug VARCHAR(255) NOT NULL`);
  }
};

// Check if columns exist and add them if needed
const ensureColumnsExist = async () => {
  try {
    // List of required columns for content table
    const requiredColumns = [
      { name: 'title', type: 'VARCHAR(255) NOT NULL' },
      { name: 'type', type: 'VARCHAR(50) NOT NULL' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'body', type: 'TEXT' },
      { name: 'status', type: "ENUM('draft', 'published', 'archived') DEFAULT 'draft'" },
      { name: 'published_at', type: 'TIMESTAMP NULL' }
    ];

    for (const column of requiredColumns) {
      const columnCheck = await query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'content' 
        AND COLUMN_NAME = '${column.name}' 
        AND TABLE_SCHEMA = DATABASE()
      `) as any[];
      
      if (columnCheck.length === 0) {
        await query(`ALTER TABLE content ADD COLUMN ${column.name} ${column.type}`);
      }
    }

    // slug needs special handling (backfill + unique index)
    await ensureSlugColumnAndIndex();
  } catch (error) {
    console.log('Column check error:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    await ensureColumnsExist();
    await ensureManagedContentTables();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const section = searchParams.get('section');
    const key = searchParams.get('key');

    if (section) {
      const data = await getManagedSectionData(section);
      return NextResponse.json({
        success: true,
        data,
      });
    }

    // Support legacy getContent(key) usage (single value)
    if (key) {
      // Accept either section.component.field or section:component:field
      const parts = key.includes('.') ? key.split('.') : key.split(':');
      if (parts.length >= 3) {
        const [kSection, kComponent, ...rest] = parts;
        const kField = rest.join('.') || 'value';
        const rows = await query(
          'SELECT value FROM managed_content_blocks WHERE section = ? AND component = ? AND field = ? LIMIT 1',
          [kSection, kComponent, kField]
        ) as any[];
        const value = Array.isArray(rows) && rows[0]?.value !== undefined ? rows[0].value : null;
        if (value === null) {
          return NextResponse.json({ value: null });
        }
        return NextResponse.json({ value: String(value) });
      }
      return NextResponse.json({ value: null });
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
    await ensureColumnsExist();
    await ensureManagedContentTables();
    
    const body = await request.json();
    const { section, data, title, type, category, slug, content: bodyContent } = body;

    // Managed content upsert
    if (section && data) {
      if (!isAdminRequest(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      await logManagedContentHistory(section, 'upsert_before');

      const entries: Array<{ component: string; field: string; value: string }> = [];
      for (const component of Object.keys(data || {})) {
        const fields = data[component] || {};
        for (const field of Object.keys(fields)) {
          entries.push({ component, field, value: String(fields[field] ?? '') });
        }
      }

      for (const e of entries) {
        await query(
          `INSERT INTO managed_content_blocks (section, component, field, value)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
          [section, e.component, e.field, e.value]
        );
      }

      await logManagedContentHistory(section, 'upsert_after');
      return NextResponse.json({ success: true, message: 'Managed content saved', section });
    }

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
    await ensureColumnsExist();
    await ensureManagedContentTables();
    
    const body = await request.json();
    const { id, status, title, type, category, slug, content: bodyContent, section, restoreHistoryId } = body;

    // Managed content restore
    if (section && restoreHistoryId) {
      if (!isAdminRequest(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const historyRows = await query(
        'SELECT snapshot FROM managed_content_history WHERE id = ? AND section = ? LIMIT 1',
        [restoreHistoryId, section]
      ) as any[];

      if (!Array.isArray(historyRows) || historyRows.length === 0) {
        return NextResponse.json({ success: false, message: 'History not found' }, { status: 404 });
      }

      const snapshotRaw = historyRows[0].snapshot;
      const snapshot = typeof snapshotRaw === 'string' ? JSON.parse(snapshotRaw) : snapshotRaw;

      await logManagedContentHistory(section, 'restore_before');

      // Replace section contents
      await query('DELETE FROM managed_content_blocks WHERE section = ?', [section]);
      if (Array.isArray(snapshot)) {
        for (const row of snapshot) {
          await query(
            'INSERT INTO managed_content_blocks (section, component, field, value) VALUES (?, ?, ?, ?)',
            [section, row.component, row.field, row.value]
          );
        }
      }

      await logManagedContentHistory(section, 'restore_after');
      return NextResponse.json({ success: true, message: 'Managed content restored' });
    }

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
    await ensureColumnsExist();
    
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
