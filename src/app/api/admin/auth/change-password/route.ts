import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword, isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = isAuthenticated(request);
    
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Current password and new password are required'
      }, { status: 400 });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'New password must be at least 8 characters long'
      }, { status: 400 });
    }

    // Change password
    const result = await changeAdminPassword(auth.user.id, currentPassword, newPassword);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Password changed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to change password'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Change password endpoint - POST only',
    method: 'POST',
    endpoint: '/api/admin/auth/change-password'
  });
}
