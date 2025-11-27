import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mysql = require('mysql2/promise');
    
    // Test 1: Try with different connection options
    console.log('Testing connection with multiple options...');
    
    const connectionConfigs = [
      {
        name: 'Basic connection',
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          connectTimeout: 10000,
          acquireTimeout: 10000,
        }
      },
      {
        name: 'Connection with SSL',
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: {
            rejectUnauthorized: false
          },
          connectTimeout: 10000,
          acquireTimeout: 10000,
        }
      },
      {
        name: 'Connection without database first',
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          connectTimeout: 10000,
          acquireTimeout: 10000,
        }
      }
    ];

    let successfulConnection = null;
    let lastError = null;

    for (const test of connectionConfigs) {
      try {
        console.log(`Trying: ${test.name}`);
        const connection = await mysql.createConnection(test.config);
        
        if (test.name.includes('without database')) {
          // Test basic server connection then select database
          await connection.execute('SELECT 1');
          await connection.changeUser({ database: process.env.DB_NAME });
        }
        
        const [result] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
        await connection.end();
        
        successfulConnection = {
          method: test.name,
          result: (result as any)[0]
        };
        break;
        
      } catch (error) {
        console.log(`${test.name} failed:`, (error as any).message);
        lastError = error;
        continue;
      }
    }

    if (successfulConnection) {
      return NextResponse.json({
        success: true,
        message: `Database connection successful using: ${successfulConnection.method}`,
        data: successfulConnection.result,
        config: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'All connection methods failed',
        lastError: {
          message: lastError instanceof Error ? lastError.message : 'Unknown error',
          code: (lastError as any).code,
          errno: (lastError as any).errno,
          sqlState: (lastError as any).sqlState
        },
        config: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME
        },
        suggestions: [
          'Check if remote MySQL access is enabled for this user',
          'Verify the hostname is correct',
          'Check if firewall allows port 3306 connections',
          'Try adding your IP to MySQL whitelist'
        ]
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Connection test failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        errno: (error as any).errno,
        sqlState: (error as any).sqlState
      }
    }, { status: 500 });
  }
}
