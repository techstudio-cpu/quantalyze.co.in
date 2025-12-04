#!/usr/bin/env node
/**
 * Database Check Script
 * Lists all tables in the Railway MySQL database
 */

const mysql = require('mysql2/promise');

async function checkDatabase() {
  const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  
  if (!connectionUrl) {
    console.error('❌ Error: No MySQL connection URL found.');
    process.exit(1);
  }

  console.log('🔄 Connecting to MySQL database...');
  
  let connection;
  try {
    connection = await mysql.createConnection(connectionUrl);
    console.log('✅ Connected to database\n');

    // List all tables
    const [tables] = await connection.query(
      "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.tables WHERE table_schema = DATABASE()"
    );
    
    console.log('📋 Tables in database:');
    console.log('─'.repeat(40));
    if (tables.length === 0) {
      console.log('   (no tables found)');
    } else {
      tables.forEach(t => {
        console.log(`   ${t.TABLE_NAME} (${t.TABLE_ROWS || 0} rows)`);
      });
    }
    console.log('─'.repeat(40));
    console.log(`   Total: ${tables.length} tables\n`);

    // Check each expected table
    const expectedTables = [
      'newsletter_subscribers',
      'contact_submissions', 
      'analytics_events',
      'services',
      'admin_users',
      'content',
      'team_members',
      'updates'
    ];

    console.log('🔍 Expected tables status:');
    for (const tableName of expectedTables) {
      const exists = tables.some(t => t.TABLE_NAME === tableName);
      console.log(`   ${exists ? '✅' : '❌'} ${tableName}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔒 Connection closed');
    }
  }
}

checkDatabase();
