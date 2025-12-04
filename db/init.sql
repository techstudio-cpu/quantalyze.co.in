-- Quantalyze Digital Agency - Database Initialization
-- This file combines schema and seed data for Railway MySQL
-- Run this file to set up the complete database

-- Set character encoding
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- SCHEMA: Create all tables
-- ============================================

-- Newsletter Subscribers Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Submissions Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Events Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content Table
CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_key VARCHAR(255) UNIQUE NOT NULL,
    content_value TEXT NOT NULL,
    content_type ENUM('text', 'html', 'json', 'markdown') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Updates Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA: Insert initial data
-- ============================================

-- Sample Services
INSERT IGNORE INTO services (title, description, icon, category, price, featured, status) VALUES
('Website Development', 'Custom, responsive websites built with modern technologies like Next.js, React, and TailwindCSS. SEO-optimized and mobile-first design.', 'FaCode', 'development', 'From ₹25,000', TRUE, 'active'),
('Digital Marketing', 'Comprehensive digital marketing strategies including SEO, SEM, social media marketing, and content marketing to grow your online presence.', 'FaChartLine', 'marketing', 'From ₹15,000/month', TRUE, 'active'),
('AI & Automation', 'Leverage artificial intelligence and automation to streamline your business processes, chatbots, and data analytics solutions.', 'FaRobot', 'technology', 'Custom Quote', TRUE, 'active'),
('Brand Identity', 'Complete brand identity design including logo, color palette, typography, and brand guidelines to establish your unique presence.', 'FaPalette', 'design', 'From ₹20,000', FALSE, 'active'),
('E-Commerce Solutions', 'Full-featured online stores with payment integration, inventory management, and seamless customer experience.', 'FaShoppingCart', 'development', 'From ₹50,000', TRUE, 'active'),
('Cloud Solutions', 'Cloud infrastructure setup, migration, and management on AWS, Google Cloud, or Azure for scalable and secure operations.', 'FaCloud', 'technology', 'Custom Quote', FALSE, 'active');

-- Sample Content
INSERT IGNORE INTO content (content_key, content_value, content_type) VALUES
('hero_title', 'Transform Your Digital Presence', 'text'),
('hero_subtitle', 'We create stunning websites and powerful digital marketing strategies that drive results.', 'text'),
('about_description', 'Quantalyze is a full-service digital agency specializing in web development, digital marketing, and AI-powered solutions.', 'text'),
('contact_email', 'info@quantalyze.co.in', 'text'),
('contact_phone', '+91 98765 43210', 'text'),
('contact_address', 'Bangalore, Karnataka, India', 'text');

-- Sample Team Member
INSERT IGNORE INTO team_members (name, email, role, department, bio, status) VALUES
('Tech Studio', 'tech.studio.st@gmail.com', 'Founder & CEO', 'Leadership', 'Passionate about technology and digital innovation.', 'active');

-- Confirmation
SELECT 'Database initialization complete!' AS status;
SELECT 'Tables created:' AS info, COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE();
