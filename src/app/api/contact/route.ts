import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let selectQuery = `
      SELECT id, name, email, phone, company, service_interest, message, status, created_at
      FROM contact_submissions
    `;
    
    const params: any[] = [];
    
    if (status) {
      selectQuery += ' WHERE status = ?';
      params.push(status);
    }
    
    selectQuery += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

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
