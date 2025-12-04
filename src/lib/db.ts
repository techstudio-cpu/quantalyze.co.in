import mysql from 'mysql2/promise';

const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

// Database connection configuration (falls back to individual fields for local dev)
const dbConfig = connectionUrl
  ? connectionUrl
  : {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'quantalyze_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };

// Create connection pool (allows either connection string or config object)
const pool = mysql.createPool(dbConfig as any);

// Test database connection
export async function testConnection() {
  try {
    const configInfo = typeof dbConfig === 'string'
      ? { connectionString: 'MYSQL_URL (hidden)' }
      : {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          database: dbConfig.database
        };
    console.log('Attempting database connection with config:', configInfo);
    
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', {
      code: (error as any).code,
      errno: (error as any).errno,
      sqlMessage: (error as any).sqlMessage,
      sqlState: (error as any).sqlState
    });
    return false;
  }
}

// Generic query function
export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction(callback: (connection: mysql.PoolConnection) => Promise<any>) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Close connection pool (for graceful shutdown)
export async function closePool() {
  await pool.end();
  console.log('Database connection pool closed');
}

export default pool;
