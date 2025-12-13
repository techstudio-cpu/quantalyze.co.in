import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Create services table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        category VARCHAR(100),
        price DECIMAL(10, 2),
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        points JSON,
        sub_services JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add missing columns if they don't exist (MySQL compatible approach)
    try {
      // Check if points column exists
      const pointsCheck = await query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'services' 
        AND COLUMN_NAME = 'points' 
        AND TABLE_SCHEMA = DATABASE()
      `) as any[];
      
      if (pointsCheck.length === 0) {
        await query('ALTER TABLE services ADD COLUMN points JSON');
      }
      
      // Check if sub_services column exists
      const subServicesCheck = await query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'services' 
        AND COLUMN_NAME = 'sub_services' 
        AND TABLE_SCHEMA = DATABASE()
      `) as any[];
      
      if (subServicesCheck.length === 0) {
        await query('ALTER TABLE services ADD COLUMN sub_services JSON');
      }
    } catch (error) {
      // Columns might already exist or other error, continue
      console.log('Column check error:', error);
    }

    // Clear existing data
    await query('DELETE FROM services');

    // Insert the services data
    const insertQuery = `
      INSERT INTO services (title, description, icon, category, price, featured, status, points, sub_services, created_at, updated_at) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    await query(insertQuery, [
      'Automation Workflow / AI Agents', 'Custom AI agent development, workflow automation, process optimization', 'FaRobot', 'automation', 45000, true, 'active',
      JSON.stringify(['Custom AI agent development', 'Workflow automation', 'Process optimization']),
      JSON.stringify([]),

      'Digital Marketing', 'Multi-channel campaigns, data-driven strategies, ROI-focused solutions', 'FaBullhorn', 'marketing', 35000, true, 'active',
      JSON.stringify(['Multi-channel campaigns', 'Data-driven strategies', 'ROI-focused solutions']),
      JSON.stringify([
        { name: 'Social Media', href: '/services/social-media-marketing', description: 'Strategic social media management and campaigns' },
        { name: 'Content Creation', href: '/services/content-writing', description: 'Engaging content that converts and resonates' },
        { name: 'Influencer Marketing', href: '/services/influencer-marketing', description: 'Connect with your audience through influencers' },
        { name: 'SEO Optimization', href: '/services/seo', description: 'Improve your search rankings and organic traffic' },
        { name: 'Community Management', href: '/services/community-management', description: 'Build and nurture your online community' },
        { name: 'Email Marketing', href: '/services/email-marketing', description: 'Targeted email campaigns that drive results' },
        { name: 'E-Commerce', href: '/services/ecommerce', description: 'Online store setup and optimization' }
      ]),

      'Web / App Development', 'Custom web applications, mobile apps, e-commerce platforms', 'FaCube', 'development', 55000, true, 'active',
      JSON.stringify(['Custom web applications', 'Mobile apps', 'E-commerce platforms']),
      JSON.stringify([]),

      'Branding', 'Brand strategy, visual identity, logo design', 'FaLightbulb', 'branding', 40000, true, 'active',
      JSON.stringify(['Brand strategy', 'Visual identity', 'Logo design']),
      JSON.stringify([]),

      'Lead Generation', 'Targeted campaigns, landing page optimization, sales funnel development', 'FaChartLine', 'marketing', 30000, true, 'active',
      JSON.stringify(['Targeted campaigns', 'Landing page optimization', 'Sales funnel development']),
      JSON.stringify([]),

      'GEO Marketing', 'Local SEO, geotargeted advertising, location-based campaigns', 'FaGlobe', 'marketing', 25000, true, 'active',
      JSON.stringify(['Local SEO', 'Geotargeted advertising', 'Location-based campaigns']),
      JSON.stringify([])
    ]);

    return NextResponse.json({
      success: true,
      message: 'Services initialized successfully'
    });

  } catch (error: any) {
    console.error('Init services error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to initialize services',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
