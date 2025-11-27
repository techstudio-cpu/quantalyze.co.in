-- Quantalyze Database Setup
-- Run this script in your MySQL database to create the necessary tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS quantalyze_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE quantalyze_db;

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  preferences JSON,
  status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service_interest VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service Inquiries Table
CREATE TABLE IF NOT EXISTS service_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service_type VARCHAR(100) NOT NULL,
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  message TEXT,
  status ENUM('new', 'contacted', 'quoted', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_service_type (service_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics/Events Table (for tracking user interactions)
CREATE TABLE IF NOT EXISTS analytics_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSON,
  user_agent TEXT,
  ip_address VARCHAR(45),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_event_type (event_type),
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_department (department),
  INDEX idx_status (status),
  INDEX idx_joined_at (joined_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_type (type),
  INDEX idx_priority (priority),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inquiries Table (for admin panel)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_service (service),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing (optional)
-- INSERT INTO newsletter_subscribers (email, name, preferences) VALUES 
-- ('test@example.com', 'Test User', '["digital-trends", "marketing-insights"]');

-- Sample services data
INSERT INTO services (title, description, icon, category, price, featured, status) VALUES 
('Social Media Marketing', 'Complete social media management and strategy', '📱', 'Marketing', 'Starting at $500/month', TRUE, 'active'),
('Website Development', 'Custom website design and development', '💻', 'Development', 'Starting at $1000', TRUE, 'active'),
('SEO Optimization', 'Search engine optimization and ranking', '🔍', 'Marketing', 'Starting at $300/month', FALSE, 'active')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Sample team data
INSERT INTO team_members (name, email, role, department, bio, status) VALUES 
('Shubham Tiwari', 'shubham@quantalyze.co.in', 'Founder & CEO', 'Management', 'Leading the digital transformation journey with expertise in marketing and technology.', 'active'),
('Tech Lead', 'tech@quantalyze.co.in', 'Technical Lead', 'Development', 'Expert in web development and automation solutions.', 'active')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Sample updates data
INSERT INTO updates (title, content, type, priority, status, published_at) VALUES 
('Website Launch', 'Quantalyze digital agency website has been successfully launched with all core features.', 'announcement', 'high', 'published', NOW()),
('Admin Panel Enhancement', 'New admin panel features added including real-time analytics and team management.', 'feature', 'medium', 'published', NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Grant permissions (adjust username and password as needed)
-- CREATE USER IF NOT EXISTS 'quantalyze_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON quantalyze_db.* TO 'quantalyze_user'@'localhost';
-- FLUSH PRIVILEGES;
