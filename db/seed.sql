-- Quantalyze Digital Agency - Seed Data
-- Initial data for Railway MySQL deployment

-- ============================================
-- Sample Services
-- ============================================
INSERT INTO services (title, description, icon, category, price, featured, status) VALUES
('Website Development', 'Custom, responsive websites built with modern technologies like Next.js, React, and TailwindCSS. SEO-optimized and mobile-first design.', 'FaCode', 'development', 'From ₹25,000', TRUE, 'active'),
('Digital Marketing', 'Comprehensive digital marketing strategies including SEO, SEM, social media marketing, and content marketing to grow your online presence.', 'FaChartLine', 'marketing', 'From ₹15,000/month', TRUE, 'active'),
('AI & Automation', 'Leverage artificial intelligence and automation to streamline your business processes, chatbots, and data analytics solutions.', 'FaRobot', 'technology', 'Custom Quote', TRUE, 'active'),
('Brand Identity', 'Complete brand identity design including logo, color palette, typography, and brand guidelines to establish your unique presence.', 'FaPalette', 'design', 'From ₹20,000', FALSE, 'active'),
('E-Commerce Solutions', 'Full-featured online stores with payment integration, inventory management, and seamless customer experience.', 'FaShoppingCart', 'development', 'From ₹50,000', TRUE, 'active'),
('Cloud Solutions', 'Cloud infrastructure setup, migration, and management on AWS, Google Cloud, or Azure for scalable and secure operations.', 'FaCloud', 'technology', 'Custom Quote', FALSE, 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- Sample Content Blocks
-- ============================================
INSERT INTO content (content_key, content_value, content_type) VALUES
('hero_title', 'Transform Your Digital Presence', 'text'),
('hero_subtitle', 'We create stunning websites and powerful digital marketing strategies that drive results.', 'text'),
('about_description', 'Quantalyze is a full-service digital agency specializing in web development, digital marketing, and AI-powered solutions. We help businesses of all sizes establish and grow their online presence.', 'text'),
('contact_email', 'info@quantalyze.co.in', 'text'),
('contact_phone', '+91 98765 43210', 'text'),
('contact_address', 'Bangalore, Karnataka, India', 'text')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- Sample Team Members
-- ============================================
INSERT INTO team_members (name, email, role, department, bio, status) VALUES
('Tech Studio', 'tech.studio.st@gmail.com', 'Founder & CEO', 'Leadership', 'Passionate about technology and digital innovation. Leading Quantalyze to help businesses succeed online.', 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
