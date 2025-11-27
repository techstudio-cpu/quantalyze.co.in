import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, testFallbackConnection } from '@/lib/fallback-db';

// Database initialization script
const createTablesSQL = `
-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(100),
  price VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  bio TEXT NOT NULL,
  avatar VARCHAR(500),
  status ENUM('active', 'inactive') DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Updates/Announcements Table
CREATE TABLE IF NOT EXISTS updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('announcement', 'maintenance', 'feature', 'bugfix') DEFAULT 'announcement',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'in-progress', 'completed', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const insertSampleDataSQL = `
-- Sample services data
INSERT IGNORE INTO services (title, description, icon, category, price, featured, status) VALUES 
('Social Media Marketing', 'Complete social media management and strategy', '📱', 'Marketing', 'Starting at $500/month', TRUE, 'active'),
('Website Development', 'Custom website design and development', '💻', 'Development', 'Starting at $1000', TRUE, 'active'),
('SEO Optimization', 'Search engine optimization and ranking', '🔍', 'Marketing', 'Starting at $300/month', FALSE, 'active'),
('Paid Advertising', 'PPC campaigns and paid social media advertising', '📢', 'Marketing', 'Starting at $400/month', FALSE, 'active'),
('Content Marketing', 'Content creation and marketing strategy', '✍️', 'Marketing', 'Starting at $350/month', FALSE, 'active'),
('Email Marketing', 'Email campaigns and newsletter management', '📧', 'Marketing', 'Starting at $250/month', FALSE, 'active'),
('Influencer Marketing', 'Influencer partnerships and campaigns', '🌟', 'Marketing', 'Starting at $600/month', FALSE, 'active'),
('Graphics Design', 'Logo design and branding materials', '🎨', 'Design', 'Starting at $200/project', FALSE, 'active'),
('Mobile App Development', 'iOS and Android app development', '📱', 'Development', 'Starting at $2000', FALSE, 'active'),
('AI & Automation', 'AI solutions and workflow automation', '🤖', 'Development', 'Starting at $1500', FALSE, 'active'),
('DevOps & Infrastructure', 'Server setup and CI/CD pipelines', '⚙️', 'Development', 'Starting at $800', FALSE, 'active'),
('Community Management', 'Online community building and management', '👥', 'Marketing', 'Starting at $300/month', FALSE, 'active'),
('Analytics & Reporting', 'Data analytics and performance reporting', '📊', 'Marketing', 'Starting at $400/month', FALSE, 'active');

-- Sample team data
INSERT IGNORE INTO team_members (name, email, role, department, bio, status) VALUES 
('Shubham Tiwari', 'shubham@quantalyze.co.in', 'Founder & CEO', 'Management', 'Leading the digital transformation journey with expertise in marketing and technology.', 'active'),
('Tech Lead', 'tech@quantalyze.co.in', 'Technical Lead', 'Development', 'Expert in web development and automation solutions.', 'active');

-- Sample updates data
INSERT IGNORE INTO updates (title, content, type, priority, status, published_at) VALUES 
('Website Launch', 'Quantalyze digital agency website has been successfully launched with all core features.', 'announcement', 'high', 'published', NOW()),
('Admin Panel Enhancement', 'New admin panel features added including real-time analytics and team management.', 'feature', 'medium', 'published', NOW()),
('Database Setup Complete', 'All required database tables have been created and populated with sample data.', 'feature', 'low', 'published', NOW());
`;

export async function POST() {
  try {
    // Check if we should use fallback (MySQL connection issues)
    let useFallback = false;
    try {
      await query('SELECT 1');
      useFallback = false;
    } catch (error) {
      console.log('MySQL not available, using SQLite fallback');
      useFallback = true;
      await testFallbackConnection();
    }

    // Create tables
    const tables = [
      'services',
      'team_members', 
      'updates',
      'inquiries'
    ];

    const results = [];

    for (const table of tables) {
      try {
        // Check if table exists
        const checkResult = useFallback
          ? await fallbackQuery(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [table])
          : await query(`SHOW TABLES LIKE ?`, [table]);

        if (!Array.isArray(checkResult) || checkResult.length === 0) {
          // Create table (simplified version for SQLite)
          let createSQL = '';
          
          if (table === 'services') {
            createSQL = `
              CREATE TABLE services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                icon TEXT,
                category TEXT,
                price TEXT,
                featured INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `;
          } else if (table === 'team_members') {
            createSQL = `
              CREATE TABLE team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT NOT NULL,
                department TEXT,
                bio TEXT NOT NULL,
                avatar TEXT,
                status TEXT DEFAULT 'active',
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `;
          } else if (table === 'updates') {
            createSQL = `
              CREATE TABLE updates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                type TEXT DEFAULT 'announcement',
                priority TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'draft',
                published_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `;
          } else if (table === 'inquiries') {
            createSQL = `
              CREATE TABLE inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                service TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'new',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `;
          }

          if (useFallback) {
            await fallbackQuery(createSQL);
          } else {
            // For MySQL, use the full SQL
            const fullCreateSQL = createTablesSQL.split('--').filter(section => 
              section.includes(table) && section.includes('CREATE TABLE')
            )[0];
            if (fullCreateSQL) {
              await query(fullCreateSQL.trim());
            }
          }

          results.push({ table, status: 'created' });
        } else {
          results.push({ table, status: 'exists' });
        }
      } catch (error) {
        console.error(`Error creating table ${table}:`, error);
        results.push({ table, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Insert sample data if tables are empty
    try {
      if (useFallback) {
        // Check if services table is empty and insert sample data
        const servicesCount = await fallbackQuery('SELECT COUNT(*) as count FROM services');
        if (Array.isArray(servicesCount) && servicesCount[0]?.count === 0) {
          const sampleServices = [
            ['Social Media Marketing', 'Complete social media management and strategy', '📱', 'Marketing', 'Starting at $500/month', 1, 'active'],
            ['Website Development', 'Custom website design and development', '💻', 'Development', 'Starting at $1000', 1, 'active'],
            ['SEO Optimization', 'Search engine optimization and ranking', '🔍', 'Marketing', 'Starting at $300/month', 0, 'active']
          ];

          for (const service of sampleServices) {
            await fallbackQuery(
              'INSERT INTO services (title, description, icon, category, price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
              service
            );
          }
        }

        // Check if team_members table is empty and insert sample data
        const teamCount = await fallbackQuery('SELECT COUNT(*) as count FROM team_members');
        if (Array.isArray(teamCount) && teamCount[0]?.count === 0) {
          const sampleTeam = [
            ['Shubham Tiwari', 'shubham@quantalyze.co.in', 'Founder & CEO', 'Management', 'Leading the digital transformation journey with expertise in marketing and technology.', 'active'],
            ['Tech Lead', 'tech@quantalyze.co.in', 'Technical Lead', 'Development', 'Expert in web development and automation solutions.', 'active']
          ];

          for (const member of sampleTeam) {
            await fallbackQuery(
              'INSERT INTO team_members (name, email, role, department, bio, status) VALUES (?, ?, ?, ?, ?, ?)',
              member
            );
          }
        }
      }
    } catch (error) {
      console.error('Error inserting sample data:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      results,
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
