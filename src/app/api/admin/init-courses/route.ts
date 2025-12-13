import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const sampleCourses = [
  {
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript. Perfect for beginners.',
    category: 'Web Development',
    price: 9999,
    duration: '8 weeks',
    level: 'Beginner',
    featured: true,
    modules: 12,
    enrolled_students: 45
  },
  {
    title: 'React.js Advanced Course',
    description: 'Master React.js with advanced concepts, hooks, and best practices for building modern web applications.',
    category: 'Web Development',
    price: 14999,
    duration: '10 weeks',
    level: 'Advanced',
    featured: true,
    modules: 16,
    enrolled_students: 32
  },
  {
    title: 'Digital Marketing Mastery',
    description: 'Complete digital marketing course covering SEO, social media, content marketing, and analytics.',
    category: 'Marketing',
    price: 7999,
    duration: '6 weeks',
    level: 'Intermediate',
    featured: false,
    modules: 10,
    enrolled_students: 28
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn user interface and user experience design principles with hands-on projects.',
    category: 'Design',
    price: 11999,
    duration: '8 weeks',
    level: 'Intermediate',
    featured: false,
    modules: 14,
    enrolled_students: 21
  },
  {
    title: 'Python for Data Science',
    description: 'Comprehensive Python course focused on data science, machine learning, and data analysis.',
    category: 'Data Science',
    price: 19999,
    duration: '12 weeks',
    level: 'Advanced',
    featured: true,
    modules: 20,
    enrolled_students: 18
  }
];

export async function POST(request: NextRequest) {
  try {
    // Create courses table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        duration VARCHAR(50),
        level VARCHAR(50),
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        modules INT DEFAULT 1,
        enrolled_students INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if courses already exist
    const existingCourses = await query('SELECT COUNT(*) as count FROM courses') as any[];
    
    if (existingCourses[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: 'Courses already initialized'
      });
    }

    // Insert sample courses
    for (const course of sampleCourses) {
      await query(`
        INSERT INTO courses 
        (title, description, category, price, duration, level, featured, status, modules, enrolled_students, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, NOW(), NOW())
      `, [
        course.title,
        course.description,
        course.category,
        course.price,
        course.duration,
        course.level,
        course.featured,
        course.modules,
        course.enrolled_students
      ]);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${sampleCourses.length} courses`
    });

  } catch (error: any) {
    console.error('Init courses error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to initialize courses',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
