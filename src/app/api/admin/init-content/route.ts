import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const sampleContent = [
  {
    title: 'Getting Started with Web Development',
    type: 'blog',
    category: 'Web Development',
    slug: 'getting-started-web-development',
    body: 'A comprehensive guide to starting your web development journey...',
    status: 'published'
  },
  {
    title: 'About Us',
    type: 'page',
    category: 'Company',
    slug: 'about',
    body: 'Learn more about our digital agency and our mission...',
    status: 'published'
  },
  {
    title: 'React Hooks Tutorial',
    type: 'tutorial',
    category: 'React',
    slug: 'react-hooks-tutorial',
    body: 'Complete tutorial on React Hooks with examples...',
    status: 'published'
  },
  {
    title: 'E-commerce Platform Redesign',
    type: 'case_study',
    category: 'Portfolio',
    slug: 'ecommerce-redesign-case-study',
    body: 'How we helped a client increase conversions by 150%...',
    status: 'published'
  },
  {
    title: 'SEO Best Practices 2024',
    type: 'blog',
    category: 'Marketing',
    slug: 'seo-best-practices-2024',
    body: 'Latest SEO strategies and techniques for 2024...',
    status: 'draft'
  },
  {
    title: 'Contact',
    type: 'page',
    category: 'Company',
    slug: 'contact',
    body: 'Get in touch with our team for your digital needs...',
    status: 'published'
  },
  {
    title: 'Node.js Performance Tips',
    type: 'tutorial',
    category: 'Backend',
    slug: 'nodejs-performance-tips',
    body: 'Optimize your Node.js applications with these tips...',
    status: 'published'
  },
  {
    title: 'Mobile App Development Case Study',
    type: 'case_study',
    category: 'Portfolio',
    slug: 'mobile-app-development-case-study',
    body: 'Building a successful mobile app from concept to launch...',
    status: 'draft'
  }
];

export async function POST(request: NextRequest) {
  try {
    // Create content table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        slug VARCHAR(255) NOT NULL UNIQUE,
        body TEXT,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if content already exists
    const existingContent = await query('SELECT COUNT(*) as count FROM content') as any[];
    
    if (existingContent[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: 'Content already initialized'
      });
    }

    // Insert sample content
    for (const content of sampleContent) {
      await query(`
        INSERT INTO content 
        (title, type, category, slug, body, status, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
      `, [
        content.title,
        content.type,
        content.category,
        content.slug,
        content.body,
        content.status
      ]);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${sampleContent.length} content items`
    });

  } catch (error: any) {
    console.error('Init content error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to initialize content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
