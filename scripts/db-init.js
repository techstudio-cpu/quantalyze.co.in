#!/usr/bin/env node
/**
 * Database Initialization Script
 * Creates all required tables for Quantalyze Digital Agency
 * 
 * Usage: node scripts/db-init.js
 * Or:    npm run db:init
 */

const mysql = require('mysql2/promise');

// Table definitions
const tables = {
  newsletter_subscribers: `
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      preferences JSON,
      status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  contact_submissions: `
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      service_interest VARCHAR(255),
      message TEXT NOT NULL,
      status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  analytics_events: `
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INT PRIMARY KEY AUTO_INCREMENT,
      event_type VARCHAR(100) NOT NULL,
      event_data JSON,
      user_agent TEXT,
      ip_address VARCHAR(45),
      session_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_event_type (event_type),
      INDEX idx_session (session_id),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  services: `
    CREATE TABLE IF NOT EXISTS services (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(100),
      category VARCHAR(100),
      price VARCHAR(100),
      featured BOOLEAN DEFAULT FALSE,
      status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_status (status),
      INDEX idx_featured (featured)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  admin_users: `
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL,
      INDEX idx_username (username),
      INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  content: `
    CREATE TABLE IF NOT EXISTS content (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content_key VARCHAR(255) UNIQUE NOT NULL,
      content_value TEXT NOT NULL,
      content_type ENUM('text', 'html', 'json', 'markdown') DEFAULT 'text',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_key (content_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  team_members: `
    CREATE TABLE IF NOT EXISTS team_members (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      bio TEXT NOT NULL,
      avatar VARCHAR(500),
      status ENUM('active', 'inactive') DEFAULT 'active',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_department (department),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  updates: `
    CREATE TABLE IF NOT EXISTS updates (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      type ENUM('announcement', 'feature', 'maintenance', 'news') NOT NULL,
      priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
      status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_type (type),
      INDEX idx_status (status),
      INDEX idx_published (published_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `
};

// Seed data
const seedData = [
  {
    table: 'services',
    sql: `INSERT IGNORE INTO services (title, description, icon, category, price, featured, status) VALUES
      ('Website Development', 'Custom, responsive websites built with modern technologies.', 'FaCode', 'development', 'From ₹25,000', TRUE, 'active'),
      ('Digital Marketing', 'Comprehensive digital marketing strategies including SEO and SEM.', 'FaChartLine', 'marketing', 'From ₹15,000/month', TRUE, 'active'),
      ('AI & Automation', 'Leverage AI to streamline your business processes.', 'FaRobot', 'technology', 'Custom Quote', TRUE, 'active'),
      ('E-Commerce Solutions', 'Full-featured online stores with payment integration.', 'FaShoppingCart', 'development', 'From ₹50,000', TRUE, 'active')`
  },
  {
    table: 'content',
    sql: `INSERT IGNORE INTO content (content_key, content_value, content_type) VALUES
      ('hero_title', 'Transform Your Digital Presence', 'text'),
      ('hero_subtitle', 'We create stunning websites and powerful digital marketing strategies.', 'text'),
      ('contact_email', 'info@quantalyze.co.in', 'text')`
  }
];

async function initDatabase() {
  const connectionUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  
  if (!connectionUrl) {
    console.error('❌ Error: No MySQL connection URL found.');
    console.error('   Set MYSQL_URL or MYSQL_PUBLIC_URL environment variable.');
    process.exit(1);
  }

  console.log('🔄 Connecting to MySQL database...');
  
  let connection;
  try {
    connection = await mysql.createConnection(connectionUrl);
    console.log('✅ Connected to database\n');

    // Create tables
    console.log('📦 Creating tables...');
    for (const [tableName, createSQL] of Object.entries(tables)) {
      try {
        await connection.query(createSQL);
        console.log(`   ✅ ${tableName}`);
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
      }
    }

    // Insert seed data
    console.log('\n🌱 Inserting seed data...');
    for (const seed of seedData) {
      try {
        const [result] = await connection.query(seed.sql);
        console.log(`   ✅ ${seed.table}: ${result.affectedRows} rows`);
      } catch (err) {
        console.log(`   ⚠️  ${seed.table}: ${err.message}`);
      }
    }

    // Verify tables
    const [tableList] = await connection.query(
      "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.tables WHERE table_schema = DATABASE()"
    );
    
    console.log('\n✅ Database initialization complete!');
    console.log(`   ${tableList.length} tables in database:`);
    tableList.forEach(t => console.log(`   - ${t.TABLE_NAME} (${t.TABLE_ROWS || 0} rows)`));

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔒 Connection closed');
    }
  }
}

initDatabase();
