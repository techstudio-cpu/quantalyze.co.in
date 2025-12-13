import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    // For now, return empty data since managed content system is not fully implemented
    // This prevents client-side errors while allowing the app to use default content
    return NextResponse.json({
      success: true,
      data: {},
      message: 'No managed content found - using defaults'
    });
  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content'
    }, { status: 500 });
  }
}
