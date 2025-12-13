-- Initialize services table with proper structure and data

-- Add missing columns if they don't exist
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS points JSON,
ADD COLUMN IF NOT EXISTS sub_services JSON;

-- Clear existing data
DELETE FROM services;

-- Insert the services data
INSERT INTO services (title, description, icon, category, price, featured, status, points, sub_services, created_at, updated_at) VALUES
('Automation Workflow / AI Agents', 'Transform your business with intelligent automation and AI-powered workflows', 'FaRobot', 'automation', 45000, TRUE, 'active', 
JSON_ARRAY('Custom AI agent development', 'Workflow automation solutions', 'Process optimization with AI', 'Intelligent customer service bots', 'Data-driven decision making'),
JSON_ARRAY(),
NOW(), NOW()),

('Digital Marketing', 'Comprehensive digital marketing strategies to grow your brand and reach', 'FaBullhorn', 'marketing', 35000, TRUE, 'active',
JSON_ARRAY('Multi-channel marketing campaigns', 'Data-driven strategy development', 'ROI-focused marketing solutions', 'Brand awareness and growth'),
JSON_ARRAY(
  JSON_OBJECT('name', 'Social Media', 'href', '/services/social-media-marketing', 'description', 'Strategic social media management and campaigns'),
  JSON_OBJECT('name', 'Content Creation', 'href', '/services/content-writing', 'description', 'Engaging content that converts and resonates'),
  JSON_OBJECT('name', 'Influencer Marketing', 'href', '/services/influencer-marketing', 'description', 'Connect with your audience through influencers'),
  JSON_OBJECT('name', 'SEO Optimization', 'href', '/services/seo', 'description', 'Improve your search rankings and organic traffic'),
  JSON_OBJECT('name', 'Community Management', 'href', '/services/community-management', 'description', 'Build and nurture your online community'),
  JSON_OBJECT('name', 'Email Marketing', 'href', '/services/email-marketing', 'description', 'Targeted email campaigns that drive results'),
  JSON_OBJECT('name', 'E-Commerce', 'href', '/services/ecommerce', 'description', 'Online store setup and optimization')
),
NOW(), NOW()),

('Web / App Development', 'Custom web and mobile applications built for performance and scalability', 'FaCube', 'development', 55000, TRUE, 'active',
JSON_ARRAY('Custom web applications', 'Mobile app development', 'E-commerce platforms', 'API development and integration', 'Progressive Web Apps (PWA)'),
JSON_ARRAY(),
NOW(), NOW()),

('Branding', 'Create a powerful brand identity that stands out in the market', 'FaLightbulb', 'branding', 40000, TRUE, 'active',
JSON_ARRAY('Brand strategy and positioning', 'Visual identity design', 'Logo and brand guidelines', 'Brand messaging and tone', 'Market research and analysis'),
JSON_ARRAY(),
NOW(), NOW()),

('Lead Generation', 'Generate high-quality leads that convert into loyal customers', 'FaChartLine', 'marketing', 30000, TRUE, 'active',
JSON_ARRAY('Targeted lead generation campaigns', 'Landing page optimization', 'Sales funnel development', 'Lead nurturing strategies', 'Conversion rate optimization'),
JSON_ARRAY(),
NOW(), NOW()),

('GEO Marketing', 'Location-based marketing strategies to reach local customers effectively', 'FaGlobe', 'marketing', 25000, TRUE, 'active',
JSON_ARRAY('Local SEO optimization', 'Geotargeted advertising', 'Location-based campaigns', 'Regional market analysis', 'Local business listings'),
JSON_ARRAY(),
NOW(), NOW());
