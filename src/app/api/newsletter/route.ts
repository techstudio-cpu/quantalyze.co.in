import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email-service';
import { getThankYouTemplate } from '@/emails/templates';

async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const safeName = name && name.trim().length > 0 ? name : email.split('@')[0];
    const template = getThankYouTemplate(safeName);

    const baseUrl = process.env.NEXTAUTH_URL || 'https://quantalyze.co.in';
    const unsubscribeUrl = `${baseUrl}/api/newsletter?action=unsubscribe&email=${encodeURIComponent(email)}`;

    const html = template.html.replace(/%unsubscribe_url%/g, unsubscribeUrl);
    const text = template.text.replace(/%unsubscribe_url%/g, unsubscribeUrl);

    await sendEmail({
      to: email,
      subject: template.subject,
      html,
      text,
    });
  } catch (error) {
    console.error('Newsletter welcome email error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const email = searchParams.get('email');
    
    // Handle unsubscribe action
    if (action === 'unsubscribe' && email) {
      const updateQuery = `
        UPDATE newsletter_subscribers 
        SET status = 'unsubscribed', 
            updated_at = NOW(),
            unsubscribed_at = NOW()
        WHERE email = ?
      `;
      const result = await query(updateQuery, [email]);

      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { success: false, message: 'Subscriber not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    }

    // Existing subscription logic
    const body = await request.json();
    const { email: subEmail, name, preferences } = body;

    if (!subEmail || !subEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    const checkQuery = 'SELECT id, status FROM newsletter_subscribers WHERE email = ?';
    const existingSubscribers = await query(checkQuery, [subEmail]) as any[];

    if (existingSubscribers.length > 0) {
      const subscriber = existingSubscribers[0];
      
      if (subscriber.status === 'active') {
        return NextResponse.json({
          success: false,
          alreadySubscribed: true,
          message: 'This email is already subscribed to our newsletter!'
        });
      } else {
        const updateQuery = `
          UPDATE newsletter_subscribers 
          SET status = 'active', 
              name = ?, 
              preferences = ?,
              updated_at = NOW()
          WHERE email = ?
        `;
        await query(updateQuery, [
          name || null,
          preferences ? JSON.stringify(preferences) : null,
          subEmail
        ]);

        await sendWelcomeEmail(subEmail, name);

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    const insertQuery = `
      INSERT INTO newsletter_subscribers (email, name, preferences, status, created_at, updated_at)
      VALUES (?, ?, ?, 'active', NOW(), NOW())
    `;
    
    await query(insertQuery, [
      subEmail,
      name || null,
      preferences ? JSON.stringify(preferences) : null
    ]);

    await sendWelcomeEmail(subEmail, name);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const email = searchParams.get('email');

    if (action === 'unsubscribe' && email) {
      const updateQuery = `
        UPDATE newsletter_subscribers 
        SET status = 'unsubscribed', 
            updated_at = NOW(),
            unsubscribed_at = NOW()
        WHERE email = ?
      `;
      const result = await query(updateQuery, [email]);

      if ((result as any).affectedRows === 0) {
        return NextResponse.json(
          { success: false, message: 'Subscriber not found' },
          { status: 404 }
        );
      }

      // Redirect to a thank you page
      const redirectUrl = new URL('/unsubscribed', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END) as unsubscribed
      FROM newsletter_subscribers
    `;
    const stats = await query(statsQuery) as any[];

    // Handle subscriber list request
    if (action === 'list') {
      const listQuery = `
        SELECT 
          id, 
          email, 
          name, 
          preferences, 
          status, 
          created_at, 
          updated_at,
          unsubscribed_at
        FROM newsletter_subscribers
        ORDER BY 
          CASE 
            WHEN status = 'active' THEN 1 
            ELSE 2 
          END,
          created_at DESC
        LIMIT 100
      `;
      const subscribers = await query(listQuery) as any[];

      return NextResponse.json({
        success: true,
        stats: stats[0],
        subscribers
      });
    }

    return NextResponse.json({
      success: true,
      stats: stats[0]
    });

  } catch (error: any) {
    console.error('Newsletter GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
