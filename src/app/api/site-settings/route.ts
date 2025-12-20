import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      scope VARCHAR(100) NOT NULL,
      settings JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_scope (scope)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS site_settings_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      scope VARCHAR(100) NOT NULL,
      action VARCHAR(50) NOT NULL,
      snapshot JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_scope (scope),
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

const logHistory = async (scope: string, action: string) => {
  const rows = await query(
    'SELECT scope, settings FROM site_settings WHERE scope = ? LIMIT 1',
    [scope]
  ) as any[];

  const snapshot = Array.isArray(rows) && rows[0] ? rows[0] : { scope, settings: {} };

  await query(
    'INSERT INTO site_settings_history (scope, action, snapshot) VALUES (?, ?, ?)',
    [scope, action, JSON.stringify(snapshot)]
  );
};

const defaultSettingsByScope: Record<string, any> = {
  footer: {
    brandText:
      'Your trusted partner in digital transformation. We help brands connect with their audience through innovative marketing strategies and cutting-edge technology.',
    socials: {
      instagram: 'https://www.instagram.com/quantalyze/',
      linkedin: 'https://www.linkedin.com/company/elevatia-private-limited/',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com'
    },
    links: {
      company: [
        { name: 'About Us', href: '/about/' },
        { name: 'Our Team', href: '/about/' },
        { name: 'Careers', href: '/about/' },
        { name: 'Contact', href: '/contact/' }
      ],
      services: [
        { name: 'Digital Marketing', href: '/services/' },
        { name: 'Web Development', href: '/services/' },
        { name: 'SEO Services', href: '/services/' },
        { name: 'Brand Strategy', href: '/services/' }
      ],
      resources: [
        { name: 'Blog', href: '/' },
        { name: 'Testimonials', href: '/testimonials/' },
        { name: 'FAQ', href: '/' }
      ],
      legal: [
        { name: 'Privacy Policy', href: '/privacy-policy/' },
        { name: 'Terms & Conditions', href: '/terms-and-conditions/' },
        { name: 'Disclaimer', href: '/disclaimer/' },
        { name: 'Cookie Policy', href: '/' }
      ]
    },
    newsletterCta: {
      title: 'Subscribe to Our Newsletter',
      subtitle: 'Get the latest updates and insights delivered to your inbox.',
      buttonText: 'Subscribe Now'
    },
    technologyPartner: {
      label: 'Technology Partner:',
      name: 'Tech Studio',
      url: 'https://techstudio.co.in'
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    await ensureTables();

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'footer';
    const action = searchParams.get('action');
    const limitParam = searchParams.get('limit');
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : 20;
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 20;

    if (action === 'history') {
      if (!isAdminRequest(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const historyRows = await query(
        `SELECT id, scope, action, snapshot, created_at
         FROM site_settings_history
         WHERE scope = ?
         ORDER BY created_at DESC
         LIMIT ${limit}`,
        [scope]
      ) as any[];

      const history = Array.isArray(historyRows)
        ? historyRows.map((r) => ({
            id: r.id,
            scope: r.scope,
            action: r.action,
            snapshot: typeof r.snapshot === 'string' ? JSON.parse(r.snapshot) : r.snapshot,
            created_at: r.created_at,
          }))
        : [];

      return NextResponse.json({ success: true, scope, history });
    }

    const rows = await query('SELECT settings FROM site_settings WHERE scope = ? LIMIT 1', [scope]) as any[];
    const settingsRaw = Array.isArray(rows) && rows[0]?.settings !== undefined ? rows[0].settings : null;
    const settings = settingsRaw
      ? typeof settingsRaw === 'string'
        ? JSON.parse(settingsRaw)
        : settingsRaw
      : defaultSettingsByScope[scope] || {};

    return NextResponse.json({ success: true, scope, settings });
  } catch (error: any) {
    console.error('Site settings GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
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
    const scope = String(body.scope || 'footer');
    const settings = body.settings ?? {};

    await logHistory(scope, 'upsert_before');

    await query(
      `INSERT INTO site_settings (scope, settings)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE settings = VALUES(settings), updated_at = NOW()`,
      [scope, JSON.stringify(settings)]
    );

    await logHistory(scope, 'upsert_after');

    return NextResponse.json({ success: true, message: 'Settings saved', scope });
  } catch (error: any) {
    console.error('Site settings POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save settings' },
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
    const scope = String(body.scope || 'footer');
    const restoreHistoryId = body.restoreHistoryId;

    if (!restoreHistoryId) {
      return NextResponse.json({ success: false, message: 'restoreHistoryId is required' }, { status: 400 });
    }

    const historyRows = await query(
      'SELECT snapshot FROM site_settings_history WHERE id = ? AND scope = ? LIMIT 1',
      [restoreHistoryId, scope]
    ) as any[];

    if (!Array.isArray(historyRows) || historyRows.length === 0) {
      return NextResponse.json({ success: false, message: 'History not found' }, { status: 404 });
    }

    const snapshotRaw = historyRows[0].snapshot;
    const snapshot = typeof snapshotRaw === 'string' ? JSON.parse(snapshotRaw) : snapshotRaw;
    const settings = snapshot?.settings ?? {};

    await logHistory(scope, 'restore_before');

    await query(
      `INSERT INTO site_settings (scope, settings)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE settings = VALUES(settings), updated_at = NOW()`,
      [scope, JSON.stringify(settings)]
    );

    await logHistory(scope, 'restore_after');

    return NextResponse.json({ success: true, message: 'Settings restored', scope });
  } catch (error: any) {
    console.error('Site settings PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore settings' },
      { status: 500 }
    );
  }
}
