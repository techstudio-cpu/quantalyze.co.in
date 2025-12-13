import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { getThankYouTemplate } from '@/emails/templates';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: 'Email and name are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        preferences JSON,
        status ENUM('active', 'unsubscribed') DEFAULT 'active',
        unsubscribed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if already subscribed
    const checkQuery = 'SELECT id, status FROM newsletter_subscribers WHERE email = ?';
    const existingSubscribers = await query(checkQuery, [email]) as any[];

    if (existingSubscribers.length > 0) {
      const subscriber = existingSubscribers[0];
      
      if (subscriber.status === 'active') {
        return NextResponse.json({
          success: false,
          alreadySubscribed: true,
          message: 'This email is already subscribed to our newsletter!'
        });
      } else {
        // Reactivate subscription
        const updateQuery = `
          UPDATE newsletter_subscribers 
          SET status = 'active', 
              name = ?, 
              updated_at = NOW()
          WHERE email = ?
        `;
        await query(updateQuery, [name, email]);
      }
    } else {
      // New subscription
      const insertQuery = `
        INSERT INTO newsletter_subscribers (email, name, status, created_at, updated_at)
        VALUES (?, ?, 'active', NOW(), NOW())
      `;
      await query(insertQuery, [email, name]);
    }

    // Send welcome email
    const template = getThankYouTemplate(name);
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (!result.success) {
      console.error('Email sending failed:', result.error);
      // Still return success since subscription was saved
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
