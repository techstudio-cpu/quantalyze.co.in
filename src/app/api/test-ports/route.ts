import { NextResponse } from 'next/server';

export async function GET() {
  const mysql = require('mysql2/promise');
  
  // Common MySQL ports to try
  const ports = [3306, 2083, 2082, 3307, 2086, 2087];
  const host = process.env.DB_HOST;
  
  const results = [];

  for (const port of ports) {
    try {
      console.log(`Testing ${host}:${port}`);
      
      const connection = await mysql.createConnection({
        host: host,
        port: port,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 5000, // 5 second timeout
      });

      await connection.execute('SELECT 1');
      await connection.end();

      results.push({
        port,
        status: 'SUCCESS',
        message: 'Connection successful'
      });

      console.log(`✅ Port ${port} - SUCCESS`);
      
    } catch (error) {
      results.push({
        port,
        status: 'FAILED',
        error: (error as any).code || 'UNKNOWN_ERROR',
        message: (error as any).message
      });

      console.log(`❌ Port ${port} - FAILED: ${(error as any).code}`);
    }
  }

  return NextResponse.json({
    message: 'Port test results',
    host: host,
    config: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    },
    results
  });
}
