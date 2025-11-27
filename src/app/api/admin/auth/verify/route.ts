import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const verification = verifyToken(token);

    if (verification.valid) {
      return NextResponse.json({
        success: true,
        user: verification.user
      });
    } else {
      return NextResponse.json({
        success: false,
        error: verification.error || 'Invalid token'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token verification failed'
    }, { status: 500 });
  }
}
