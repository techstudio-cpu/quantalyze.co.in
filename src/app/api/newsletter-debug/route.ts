import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Newsletter Debug Start ===');
    
    // Test 1: Check if we can read the request
    const body = await request.json();
    console.log('Request body:', body);
    
    // Test 2: Test SQLite connection directly
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');
    const path = require('path');
    
    console.log('Testing SQLite connection...');
    const dbPath = path.join(process.cwd(), 'data', 'newsletter.db');
    console.log('Database path:', dbPath);
    
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory');
    }
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log('SQLite connected successfully');
    
    // Test 3: Create table if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        preferences TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table ensured');
    
    // Test 4: Insert test data
    await db.run(
      'INSERT OR IGNORE INTO newsletter_subscribers (email, name, preferences) VALUES (?, ?, ?)',
      [body.email, body.name || null, JSON.stringify(body.preferences || [])]
    );
    console.log('Data inserted successfully');
    
    // Test 5: Query back the data
    const result = await db.get('SELECT * FROM newsletter_subscribers WHERE email = ?', [body.email]);
    console.log('Query result:', result);
    
    await db.close();
    
    console.log('=== Newsletter Debug End ===');
    
    return NextResponse.json({
      success: true,
      message: 'Debug subscription successful!',
      data: {
        email: body.email,
        inserted: result,
        database: 'SQLite (Local - Debug)'
      }
    });
    
  } catch (error) {
    console.error('=== Newsletter Debug Error ===');
    console.error('Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      code: (error as any).code
    });
    
    return NextResponse.json({
      success: false,
      message: 'Debug subscription failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }
    }, { status: 500 });
  }
}
