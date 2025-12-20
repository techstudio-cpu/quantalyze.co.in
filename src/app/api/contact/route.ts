import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email-service';
import { getInquiryDraftTemplate } from '@/emails/templates';
import { verifyToken } from '@/lib/auth';

// Create table if it doesn't exist (this will run on first API call)
const ensureTableExists = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        service_interest VARCHAR(255),
        message TEXT,
        status ENUM('new', 'in-progress', 'completed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log('Contact table may already exist:', error);
  }
};

const isAdminRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  return verification.valid;
};

export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO contact_submissions 
      (name, email, phone, company, service_interest, message, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())
    `;
    
    await query(insertQuery, [
      name,
      email,
      phone || null,
      company || null,
      service || null,
      message
    ]);

    const analyticsQuery = `
      INSERT INTO analytics_events (event_type, event_data, created_at)
      VALUES ('contact_form_submission', ?, NOW())
    `;
    
    await query(analyticsQuery, [
      JSON.stringify({ email, service, company })
    ]);

    // Send draft email to admin
    const template = getInquiryDraftTemplate({ name, email, phone, message });
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `[DRAFT] ${template.subject}`,
      html: template.html,
      replyTo: email,
    });

    if (!emailResult.success) {
      console.error('Failed to send admin email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit your inquiry. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();

    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : 50;
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 1000) : 50;

    let selectQuery = `
      SELECT id, name, email, phone, company, service_interest, message, status, created_at
      FROM contact_submissions
    `;
    
    const params: any[] = [];
    
    if (status) {
      selectQuery += ' WHERE status = ?';
      params.push(status);
    }
    
    selectQuery += ' ORDER BY created_at DESC';

    // IMPORTANT: Some MySQL environments can error on prepared statements with LIMIT ?
    // Always inline a sanitized integer limit.
    selectQuery += ` LIMIT ${limit}`;

    const submissions = await query(selectQuery, params);

    return NextResponse.json({
      success: true,
      submissions
    });

  } catch (error: any) {
    console.error('Contact GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch submissions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE contact_submissions 
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    await query(updateQuery, [status, id]);

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error: any) {
    console.error('Contact PATCH error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
