import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database | null = null;

// Initialize SQLite database for local development
export async function initFallbackDB() {
  if (db) return db;

  try {
    const dbPath = path.join(process.cwd(), 'data', 'newsletter.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create newsletter subscribers table
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

    return db;
  } catch (error) {
    throw error;
  }
}

// Fallback query function for local development
export async function fallbackQuery(sql: string, params: any[] = []) {
  try {
    const database = await initFallbackDB();
    const result = await database.all(sql, params);
    return result;
  } catch (error) {
    console.error('SQLite query error:', error);
    throw error;
  }
}

// Test SQLite connection
export async function testFallbackConnection() {
  try {
    const database = await initFallbackDB();
    await database.get('SELECT 1');
    console.log('✅ SQLite fallback database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ SQLite fallback database connection failed:', error);
    return false;
  }
}

// Close SQLite database
export async function closeFallbackDB() {
  if (db) {
    await db.close();
    db = null;
    console.log('SQLite fallback database closed');
  }
}
