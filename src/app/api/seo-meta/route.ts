import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS seo_meta (
      id INT AUTO_INCREMENT PRIMARY KEY,
      route VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      description TEXT,
      keywords TEXT,
      og_title VARCHAR(255),
      og_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_route (route)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS seo_meta_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      route VARCHAR(255) NOT NULL,
      action VARCHAR(50) NOT NULL,
      snapshot JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_route (route),
      INDEX idx_action (action),
      INDEX idx_created_at (created_at)
    )
  `);
};

const isAdminRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  return verification.valid;
};

const logHistory = async (route: string, action: string) => {
  const rows = await query(
    'SELECT route, title, description, keywords, og_title, og_description FROM seo_meta WHERE route = ? LIMIT 1',
    [route]
  ) as any[];

  const snapshot = Array.isArray(rows) && rows[0] ? rows[0] : { route, title: null, description: null, keywords: null, og_title: null, og_description: null };

  await query(
    'INSERT INTO seo_meta_history (route, action, snapshot) VALUES (?, ?, ?)',
    [route, action, JSON.stringify(snapshot)]
  );
};

export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route') || '/';
    const action = searchParams.get('action');
    const limitParam = searchParams.get('limit');
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : 20;
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 20;

    if (action === 'history') {
      if (!isAdminRequest(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const historyRows = await query(
        `SELECT id, route, action, snapshot, created_at
         FROM seo_meta_history
         WHERE route = ?
         ORDER BY created_at DESC
         LIMIT ${limit}`,
        [route]
      ) as any[];

      const history = Array.isArray(historyRows)
        ? historyRows.map((r) => ({
            id: r.id,
            route: r.route,
            action: r.action,
            snapshot: typeof r.snapshot === 'string' ? JSON.parse(r.snapshot) : r.snapshot,
            created_at: r.created_at,
          }))
        : [];

      return NextResponse.json({ success: true, route, history });
    }

    const rows = await query(
      'SELECT route, title, description, keywords, og_title, og_description FROM seo_meta WHERE route = ? LIMIT 1',
      [route]
    ) as any[];

    const meta = Array.isArray(rows) && rows[0] ? rows[0] : null;
    return NextResponse.json({ success: true, route, meta });
  } catch (error: any) {
    console.error('SEO meta GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch SEO meta' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const route = String(body.route || '/');
    const title = body.title ?? null;
    const description = body.description ?? null;
    const keywords = body.keywords ?? null;
    const og_title = body.og_title ?? null;
    const og_description = body.og_description ?? null;

    await logHistory(route, 'upsert_before');

    await query(
      `INSERT INTO seo_meta (route, title, description, keywords, og_title, og_description)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         keywords = VALUES(keywords),
         og_title = VALUES(og_title),
         og_description = VALUES(og_description),
         updated_at = NOW()`,
      [route, title, description, keywords, og_title, og_description]
    );

    await logHistory(route, 'upsert_after');

    return NextResponse.json({ success: true, message: 'SEO meta saved', route });
  } catch (error: any) {
    console.error('SEO meta POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save SEO meta' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureTables();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const route = String(body.route || '/');
    const restoreHistoryId = body.restoreHistoryId;

    if (!restoreHistoryId) {
      return NextResponse.json({ success: false, message: 'restoreHistoryId is required' }, { status: 400 });
    }

    const historyRows = await query(
      'SELECT snapshot FROM seo_meta_history WHERE id = ? AND route = ? LIMIT 1',
      [restoreHistoryId, route]
    ) as any[];

    if (!Array.isArray(historyRows) || historyRows.length === 0) {
      return NextResponse.json({ success: false, message: 'History not found' }, { status: 404 });
    }

    const snapshotRaw = historyRows[0].snapshot;
    const snapshot = typeof snapshotRaw === 'string' ? JSON.parse(snapshotRaw) : snapshotRaw;

    await logHistory(route, 'restore_before');

    await query(
      `INSERT INTO seo_meta (route, title, description, keywords, og_title, og_description)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         keywords = VALUES(keywords),
         og_title = VALUES(og_title),
         og_description = VALUES(og_description),
         updated_at = NOW()`,
      [
        route,
        snapshot?.title ?? null,
        snapshot?.description ?? null,
        snapshot?.keywords ?? null,
        snapshot?.og_title ?? null,
        snapshot?.og_description ?? null
      ]
    );

    await logHistory(route, 'restore_after');

    return NextResponse.json({ success: true, message: 'SEO meta restored', route });
  } catch (error: any) {
    console.error('SEO meta PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore SEO meta' },
      { status: 500 }
    );
  }
}
