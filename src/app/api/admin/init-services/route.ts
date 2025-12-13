import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const auth = isAuthenticated(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add missing columns if they don't exist
    try {
      await query(`
        ALTER TABLE services 
        ADD COLUMN IF NOT EXISTS points JSON,
        ADD COLUMN IF NOT EXISTS sub_services JSON
      `);
    } catch (error) {
      // Columns might already exist, continue
      console.log('Columns may already exist:', error);
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
      'Automation Workflow / AI Agents', 'Transform your business with intelligent automation and AI-powered workflows', 'FaRobot', 'automation', 45000, true, 'active',
      JSON.stringify(['Custom AI agent development', 'Workflow automation solutions', 'Process optimization with AI', 'Intelligent customer service bots', 'Data-driven decision making']),
      JSON.stringify([]),

      'Digital Marketing', 'Comprehensive digital marketing strategies to grow your brand and reach', 'FaBullhorn', 'marketing', 35000, true, 'active',
      JSON.stringify(['Multi-channel marketing campaigns', 'Data-driven strategy development', 'ROI-focused marketing solutions', 'Brand awareness and growth']),
      JSON.stringify([
        { name: 'Social Media', href: '/services/social-media-marketing', description: 'Strategic social media management and campaigns' },
        { name: 'Content Creation', href: '/services/content-writing', description: 'Engaging content that converts and resonates' },
        { name: 'Influencer Marketing', href: '/services/influencer-marketing', description: 'Connect with your audience through influencers' },
        { name: 'SEO Optimization', href: '/services/seo', description: 'Improve your search rankings and organic traffic' },
        { name: 'Community Management', href: '/services/community-management', description: 'Build and nurture your online community' },
        { name: 'Email Marketing', href: '/services/email-marketing', description: 'Targeted email campaigns that drive results' },
        { name: 'E-Commerce', href: '/services/ecommerce', description: 'Online store setup and optimization' }
      ]),

      'Web / App Development', 'Custom web and mobile applications built for performance and scalability', 'FaCube', 'development', 55000, true, 'active',
      JSON.stringify(['Custom web applications', 'Mobile app development', 'E-commerce platforms', 'API development and integration', 'Progressive Web Apps (PWA)']),
      JSON.stringify([]),

      'Branding', 'Create a powerful brand identity that stands out in the market', 'FaLightbulb', 'branding', 40000, true, 'active',
      JSON.stringify(['Brand strategy and positioning', 'Visual identity design', 'Logo and brand guidelines', 'Brand messaging and tone', 'Market research and analysis']),
      JSON.stringify([]),

      'Lead Generation', 'Generate high-quality leads that convert into loyal customers', 'FaChartLine', 'marketing', 30000, true, 'active',
      JSON.stringify(['Targeted lead generation campaigns', 'Landing page optimization', 'Sales funnel development', 'Lead nurturing strategies', 'Conversion rate optimization']),
      JSON.stringify([]),

      'GEO Marketing', 'Location-based marketing strategies to reach local customers effectively', 'FaGlobe', 'marketing', 25000, true, 'active',
      JSON.stringify(['Local SEO optimization', 'Geotargeted advertising', 'Location-based campaigns', 'Regional market analysis', 'Local business listings']),
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
