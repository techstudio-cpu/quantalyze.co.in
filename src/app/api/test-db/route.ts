import { NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed - check server logs for details',
        config: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      }, { status: 500 });
    }
    
    // Test basic query
    const result = await query('SELECT NOW() as current_time, VERSION() as mysql_version');
    
    // Test table creation (newsletter_subscribers)
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        preferences JSON,
        status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Check if table exists and get count
    const tableInfo = await query('SELECT COUNT(*) as subscriber_count FROM newsletter_subscribers');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        currentTime: (result as any[])[0]?.current_time,
        mysqlVersion: (result as any[])[0]?.mysql_version,
        subscriberCount: (tableInfo as any[])[0]?.subscriber_count
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        code: (error as any).code,
        errno: (error as any).errno,
        sqlState: (error as any).sqlState
      }
    }, { status: 500 });
  }
}
