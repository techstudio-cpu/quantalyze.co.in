import { NextRequest, NextResponse } from 'next/server';
import { fallbackQuery } from '@/lib/fallback-db';
import { sendPasswordResetEmail } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Check if email exists in admin users
    const users = await fallbackQuery(
      'SELECT id, username FROM admin_users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, reset instructions will be sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token in database
    await fallbackQuery(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users (id)
      )
    `);

    // Clean up old tokens
    await fallbackQuery('DELETE FROM password_resets WHERE expires_at < CURRENT_TIMESTAMP');

    // Insert new reset token
    await fallbackQuery(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [users[0].id, resetToken, resetTokenExpiry.toISOString()]
    );

    // Send reset email (mock implementation)
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Password reset instructions have been sent to your email.'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send reset email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forgot password endpoint - POST only',
    method: 'POST',
    endpoint: '/api/admin/auth/forgot-password'
  });
}
