import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10)
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username !== ADMIN_CREDENTIALS.username) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        username: ADMIN_CREDENTIALS.username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = {
      username: ADMIN_CREDENTIALS.username,
      role: 'admin'
    };

    return NextResponse.json({
      success: true,
      token,
      user
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
