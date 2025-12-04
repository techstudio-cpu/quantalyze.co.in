import mysql from 'mysql2/promise';

// Lazy-initialized connection pool to prevent startup crashes
let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
    
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
    
    pool = mysql.createPool(dbConfig as any);
  }
  return pool;
}

// Test database connection
export async function testConnection() {
  try {
    console.log('Attempting database connection...');
    const dbPool = getPool();
    const connection = await dbPool.getConnection();
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
    const dbPool = getPool();
    const [rows] = await dbPool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction(callback: (connection: mysql.PoolConnection) => Promise<any>) {
  const dbPool = getPool();
  const connection = await dbPool.getConnection();
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
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
}

// Export getPool for direct access if needed
export { getPool };
export default getPool;
