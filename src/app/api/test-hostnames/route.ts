import { NextResponse } from 'next/server';

export async function GET() {
  const mysql = require('mysql2/promise');
  
  // Common StackCP MySQL hostnames to try
  const hostnames = [
    'stackcp.com',
    'mysql.stackcp.com', 
    'localhost',
    '127.0.0.1',
    'sdb-78.hosting.stackcp.net',
    'mysql-78.stackcp.net',
    'db.stackcp.com',
    'database.stackcp.com'
  ];

  const results = [];

  for (const hostname of hostnames) {
    try {
      console.log(`Testing hostname: ${hostname}`);
      
      const connection = await mysql.createConnection({
        host: hostname,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 5000, // 5 second timeout
      });

      await connection.execute('SELECT 1');
      await connection.end();

      results.push({
        hostname,
        status: 'SUCCESS',
        message: 'Connection successful'
      });

      console.log(`✅ ${hostname} - SUCCESS`);
      
    } catch (error) {
      results.push({
        hostname,
        status: 'FAILED',
        error: (error as any).code || 'UNKNOWN_ERROR',
        message: (error as any).message
      });

      console.log(`❌ ${hostname} - FAILED: ${(error as any).code}`);
    }
  }

  return NextResponse.json({
    message: 'Hostname test results',
    config: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    results
  });
}
