import { NextRequest, NextResponse } from 'next/server';
import { fallbackQuery } from '@/lib/fallback-db';

// Get content for website components
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (!section) {
      return NextResponse.json({
        success: false,
        message: 'Section parameter is required'
      }, { status: 400 });
    }
    
    // Get content for the specific section
    const content = await fallbackQuery(
      'SELECT * FROM website_content WHERE section = ? ORDER BY component, field_name',
      [section]
    );
    
    if (!Array.isArray(content) || content.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No content found for this section'
      }, { status: 404 });
    }
    
    // Transform content into a more usable format
    const transformedContent: Record<string, any> = {};
    content.forEach((item: any) => {
      if (!transformedContent[item.component]) {
        transformedContent[item.component] = {};
      }
      transformedContent[item.component][item.field_name] = item.field_value;
    });
    
    return NextResponse.json({
      success: true,
      data: transformedContent
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch content'
    }, { status: 500 });
  }
}
