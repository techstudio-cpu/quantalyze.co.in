import mysql from 'mysql2/promise';
import { fallbackQuery as sqliteQuery, fallbackRun as sqliteRun, initFallbackDB } from './fallback-db';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Check if Railway MySQL is available (MYSQL_URL is auto-set by Railway)
const hasRailwayMySQL = !!process.env.MYSQL_URL || !!process.env.MYSQLHOST;

// MySQL connection pool (only created in production)
let mysqlPool: mysql.Pool | null = null;

// Get MySQL configuration from environment
function getMySQLConfig() {
  // Railway MySQL environment variables
  if (process.env.MYSQL_URL) {
    return { uri: process.env.MYSQL_URL };
  }
  
  return {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'quantalyze_db',
  };
}

// Initialize MySQL pool for production
function getMySQLPool() {
  if (!mysqlPool && isProduction) {
    const config = getMySQLConfig();
    
    if ('uri' in config && config.uri) {
      // Use connection URI (Railway format)
      mysqlPool = mysql.createPool(config.uri);
      console.log('[DB] Using MySQL connection URI');
    } else {
      // Use individual config options
      mysqlPool = mysql.createPool({
        ...config,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
      console.log(`[DB] Connecting to MySQL at ${config.host}:${config.port}`);
    }
  }
  return mysqlPool;
}

// Convert SQLite-style queries to MySQL-style
function convertToMySQL(sql: string): string {
  return sql
    .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'INT PRIMARY KEY AUTO_INCREMENT')
    .replace(/TEXT/g, 'VARCHAR(500)')
    .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    .replace(/\?/g, '?'); // MySQL also uses ? for parameters
}

// Initialize database tables (works for both SQLite and MySQL)
export async function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id ${isProduction ? 'INT PRIMARY KEY AUTO_INCREMENT' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      username ${isProduction ? 'VARCHAR(255)' : 'TEXT'} UNIQUE NOT NULL,
      email ${isProduction ? 'VARCHAR(255)' : 'TEXT'} UNIQUE NOT NULL,
      password ${isProduction ? 'VARCHAR(255)' : 'TEXT'} NOT NULL,
      role ${isProduction ? 'VARCHAR(50)' : 'TEXT'} DEFAULT 'admin',
      created_at ${isProduction ? 'TIMESTAMP' : 'DATETIME'} DEFAULT CURRENT_TIMESTAMP,
      last_login ${isProduction ? 'TIMESTAMP NULL' : 'DATETIME'}
    )
  `;

  try {
    if (isProduction) {
      const pool = getMySQLPool();
      if (pool) {
        await pool.execute(createTableSQL);
        console.log('✅ MySQL admin_users table initialized');
      }
    } else {
      await initFallbackDB();
      console.log('✅ SQLite admin_users table initialized');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Unified query function - automatically uses MySQL in production, SQLite in development
export async function query(sql: string, params: any[] = []): Promise<any[]> {
  try {
    if (isProduction) {
      const pool = getMySQLPool();
      if (!pool) {
        throw new Error('MySQL pool not initialized');
      }
      
      // Convert SQLite syntax to MySQL if needed
      const mysqlSQL = convertToMySQL(sql);
      const [rows] = await pool.execute(mysqlSQL, params);
      return rows as any[];
    } else {
      // Use SQLite for development
      const result = await sqliteQuery(sql, params);
      return result as any[];
    }
  } catch (error) {
    console.error('Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Unified run function for INSERT/UPDATE/DELETE
export async function run(sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
  try {
    if (isProduction) {
      const pool = getMySQLPool();
      if (!pool) {
        throw new Error('MySQL pool not initialized');
      }
      
      const mysqlSQL = convertToMySQL(sql);
      const [result] = await pool.execute(mysqlSQL, params) as any;
      return { 
        lastID: result.insertId, 
        changes: result.affectedRows 
      };
    } else {
      const result = await sqliteRun(sql, params);
      return { 
        lastID: (result as any)?.lastID, 
        changes: (result as any)?.changes 
      };
    }
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    if (isProduction) {
      const pool = getMySQLPool();
      if (!pool) return false;
      
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ MySQL connection successful');
      return true;
    } else {
      await initFallbackDB();
      console.log('✅ SQLite connection successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Get database type for debugging
export function getDatabaseType(): string {
  return isProduction ? 'MySQL' : 'SQLite';
}

// Close database connections
export async function closeConnections() {
  if (mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
    console.log('MySQL connection pool closed');
  }
}

export default {
  query,
  run,
  initDatabase,
  testConnection,
  getDatabaseType,
  closeConnections
};
