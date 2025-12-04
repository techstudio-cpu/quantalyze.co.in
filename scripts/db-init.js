#!/usr/bin/env node
/**
 * Database Initialization Script
 * Runs the init.sql file against the Railway MySQL database
 * 
 * Usage: node scripts/db-init.js
 * Or:    npm run db:init
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  // Get connection URL from environment
  const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  
  if (!connectionUrl) {
    console.error('❌ Error: No MySQL connection URL found.');
    console.error('   Set MYSQL_URL or MYSQL_PUBLIC_URL environment variable.');
    console.error('');
    console.error('   Example:');
    console.error('   MYSQL_PUBLIC_URL=mysql://root:password@host:port/database npm run db:init');
    process.exit(1);
  }

  console.log('🔄 Connecting to MySQL database...');
  
  let connection;
  try {
    connection = await mysql.createConnection(connectionUrl);
    console.log('✅ Connected to database');

    // Read the init.sql file
    const initSqlPath = path.join(__dirname, '..', 'db', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('🔄 Running database initialization...');
    
    // Split by semicolons and run each statement
    const statements = initSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await connection.query(statement);
        // Log CREATE TABLE statements
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
          if (match) {
            console.log(`   ✓ Table: ${match[1]}`);
          }
        }
      } catch (err) {
        // Ignore duplicate key errors for INSERT IGNORE
        if (err.code !== 'ER_DUP_ENTRY') {
          console.warn(`   ⚠ Warning: ${err.message}`);
        }
      }
    }

    // Verify tables were created
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = DATABASE()"
    );
    
    console.log('');
    console.log('✅ Database initialization complete!');
    console.log(`   Created ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.TABLE_NAME}`));

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔒 Connection closed');
    }
  }
}

initDatabase();
