import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, testFallbackConnection } from '@/lib/fallback-db';
import z from 'zod';

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  preferences: z.array(z.string()).optional(),
});

// Check if we should use fallback (MySQL connection issues)
let useFallback = false;
let fallbackChecked = false;

async function checkFallback() {
  if (!fallbackChecked) {
    // Try to test MySQL connection
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

export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    
    // Validate input
    const validatedData = newsletterSchema.parse(body);
    
    // Check if email already exists
    const existingSubscriber = useFallback 
      ? await fallbackQuery(
          'SELECT id, status FROM newsletter_subscribers WHERE email = ?',
          [validatedData.email]
        )
      : await query(
          'SELECT id, status FROM newsletter_subscribers WHERE email = ?',
          [validatedData.email]
        );
    
    if (Array.isArray(existingSubscriber) && existingSubscriber.length > 0) {
      const subscriber = existingSubscriber[0] as any;
      
      // If unsubscribed, reactivate
      if (subscriber.status === 'unsubscribed') {
        if (useFallback) {
          await fallbackQuery(
            'UPDATE newsletter_subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
            ['active', validatedData.email]
          );
        } else {
          await query(
            'UPDATE newsletter_subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
            ['active', validatedData.email]
          );
        }
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been re-subscribed to our newsletter.',
          reactivated: true,
          database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
        });
      }
      
      // Already subscribed
      return NextResponse.json({
        success: false,
        message: 'This email is already subscribed to our newsletter.',
        alreadySubscribed: true,
        database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
      }, { status: 409 });
    }
    
    // Insert new subscriber
    if (useFallback) {
      await fallbackQuery(
        `INSERT INTO newsletter_subscribers (email, name, preferences) VALUES (?, ?, ?)`,
        [
          validatedData.email,
          validatedData.name || null,
          JSON.stringify(validatedData.preferences || [])
        ]
      );
    } else {
      await query(
        `INSERT INTO newsletter_subscribers (email, name, preferences) VALUES (?, ?, ?)`,
        [
          validatedData.email,
          validatedData.name || null,
          JSON.stringify(validatedData.preferences || [])
        ]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: validatedData.email,
        subscribedAt: new Date().toISOString()
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: zodError.errors ?? []
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await checkFallback();

    const subscribers = useFallback
      ? await fallbackQuery(
          'SELECT id, email, name, status, created_at, preferences FROM newsletter_subscribers ORDER BY created_at DESC'
        )
      : await query(
          'SELECT id, email, name, status, created_at, preferences FROM newsletter_subscribers ORDER BY created_at DESC'
        );
    
    return NextResponse.json({
      success: true,
      data: subscribers,
      count: Array.isArray(subscribers) ? subscribers.length : 0,
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch subscribers',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Subscriber ID is required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete subscriber',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: 'Subscriber ID and status are required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery(
        'UPDATE newsletter_subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
    } else {
      await query(
        'UPDATE newsletter_subscribers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscriber status updated successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update subscriber',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}
