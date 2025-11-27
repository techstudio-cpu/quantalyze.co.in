import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, generateToken, initializeAdminUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Initialize admin user if not exists
    await initializeAdminUser();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }

    // Authenticate user
    const authResult = await authenticateAdmin(username, password);

    if (authResult.success && authResult.user) {
      // Generate JWT token
      const token = generateToken(authResult.user);

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: authResult.user.id,
          username: authResult.user.username,
          email: authResult.user.email,
          role: authResult.user.role
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Authentication failed'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint - POST only',
    method: 'POST',
    endpoint: '/api/admin/auth/login'
  });
}
