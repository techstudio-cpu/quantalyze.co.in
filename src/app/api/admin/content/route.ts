import { NextRequest, NextResponse } from 'next/server';
import { initContentTables } from '@/lib/content-utils';
import { fallbackQuery } from '@/lib/fallback-db';

// Get all content or specific section content
export async function GET(request: NextRequest) {
  try {
    await initContentTables();
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (section) {
      // Get specific section content
      const content = await fallbackQuery(
        'SELECT * FROM website_content WHERE section = ? ORDER BY component, field_name',
        [section]
      );
      
      return NextResponse.json({
        success: true,
        data: content,
        section
      });
    } else {
      // Get all sections and their content
      const sections = await fallbackQuery(
        'SELECT * FROM website_sections ORDER BY section_order'
      );
      
      const allContent = await fallbackQuery(
        'SELECT * FROM website_content ORDER BY section, component, field_name'
      );
      
      // Group content by section
      const contentBySection: { [key: string]: any[] } = {};
      allContent.forEach((item: any) => {
        if (!contentBySection[item.section]) {
          contentBySection[item.section] = [];
        }
        contentBySection[item.section].push(item);
      });
      
      return NextResponse.json({
        success: true,
        data: {
          sections,
          content: contentBySection
        }
      });
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch content'
    }, { status: 500 });
  }
}

// Update content
export async function PUT(request: NextRequest) {
  try {
    await initContentTables();
    
    const { section, component, fieldName, fieldValue, fieldType } = await request.json();
    
    if (!section || !component || !fieldName) {
      return NextResponse.json({
        success: false,
        message: 'Section, component, and field name are required'
      }, { status: 400 });
    }
    
    // Upsert content
    await fallbackQuery(`
      INSERT OR REPLACE INTO website_content 
      (section, component, field_name, field_value, field_type, updated_at) 
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [section, component, fieldName, fieldValue, fieldType || 'text']);
    
    return NextResponse.json({
      success: true,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update content'
    }, { status: 500 });
  }
}

// Create new section
export async function POST(request: NextRequest) {
  try {
    await initContentTables();
    
    const { sectionId, sectionName, sectionOrder } = await request.json();
    
    if (!sectionId || !sectionName) {
      return NextResponse.json({
        success: false,
        message: 'Section ID and name are required'
      }, { status: 400 });
    }
    
    await fallbackQuery(`
      INSERT OR REPLACE INTO website_sections 
      (section_id, section_name, section_order) 
      VALUES (?, ?, ?)
    `, [sectionId, sectionName, sectionOrder || 0]);
    
    return NextResponse.json({
      success: true,
      message: 'Section created successfully'
    });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create section'
    }, { status: 500 });
  }
}

// Delete content
export async function DELETE(request: NextRequest) {
  try {
    await initContentTables();
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const component = searchParams.get('component');
    const fieldName = searchParams.get('field');
    
    if (!section) {
      return NextResponse.json({
        success: false,
        message: 'Section is required'
      }, { status: 400 });
    }
    
    let query = 'DELETE FROM website_content WHERE section = ?';
    let params = [section];
    
    if (component) {
      query += ' AND component = ?';
      params.push(component);
    }
    
    if (fieldName) {
      query += ' AND field_name = ?';
      params.push(fieldName);
    }
    
    await fallbackQuery(query, params);
    
    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete content'
    }, { status: 500 });
  }
}
