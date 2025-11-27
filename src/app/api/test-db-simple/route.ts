import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    // Try connection without SSL first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Simple database connection successful!',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
      },
      result: rows
    });

  } catch (error) {
    console.error('Simple connection test failed:', error);
    
    // Try with SSL if without SSL fails
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
          rejectUnauthorized: false
        }
      });

      const [rows] = await connection.execute('SELECT 1 as test');
      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Database connection successful with SSL!',
        config: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME,
          ssl: true
        },
        result: rows
      });

    } catch (sslError) {
      console.error('SSL connection also failed:', sslError);
      
      return NextResponse.json({
        success: false,
        message: 'Both connection attempts failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        sslError: sslError instanceof Error ? sslError.message : 'Unknown SSL error',
        config: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      }, { status: 500 });
    }
  }
}
