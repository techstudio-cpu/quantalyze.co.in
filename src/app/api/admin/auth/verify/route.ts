import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = {
      username: decoded.username,
      role: decoded.role
    };

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.error('Token verification error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid or expired token',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 401 }
    );
  }
}
