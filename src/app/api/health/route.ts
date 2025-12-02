import { NextResponse } from 'next/server';
import { testConnection, getDatabaseType } from '@/lib/unified-db';

export async function GET() {
  try {
    // Test database connection
    let dbStatus = 'unknown';
    let dbType = 'unknown';
    
    try {
      dbType = getDatabaseType();
      const connected = await testConnection();
      dbStatus = connected ? 'connected' : 'disconnected';
    } catch (dbError) {
      dbStatus = 'error';
      console.error('DB health check failed:', dbError);
    }

    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
      database: {
        type: dbType,
        status: dbStatus,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
      railway: !!process.env.RAILWAY_PUBLIC_DOMAIN,
    };

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
