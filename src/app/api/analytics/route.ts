import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, event_data, session_id } = body;

    if (!event_type) {
      return NextResponse.json(
        { success: false, message: 'Event type is required' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    const insertQuery = `
      INSERT INTO analytics_events 
      (event_type, event_data, user_agent, ip_address, session_id, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    await query(insertQuery, [
      event_type,
      event_data ? JSON.stringify(event_data) : null,
      userAgent,
      ipAddress,
      session_id || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to track event',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const eventType = searchParams.get('event_type');

    let statsQuery = `
      SELECT 
        event_type,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM analytics_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    
    const params: any[] = [days];
    
    if (eventType) {
      statsQuery += ' AND event_type = ?';
      params.push(eventType);
    }
    
    statsQuery += ' GROUP BY event_type, DATE(created_at) ORDER BY date DESC';

    const stats = await query(statsQuery, params);

    const summaryQuery = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM analytics_events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    
    const summary = await query(summaryQuery, [days]) as any[];

    return NextResponse.json({
      success: true,
      stats,
      summary: summary[0]
    });

  } catch (error: any) {
    console.error('Analytics GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
