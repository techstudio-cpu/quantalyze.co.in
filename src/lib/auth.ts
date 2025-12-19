import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, testConnection } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Admin user interface
interface AdminUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

// Initialize admin user if not exists
export async function initializeAdminUser() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('[Auth] Database not available, skipping admin user initialization');
      return;
    }

    // Check if admin user exists
    const existingAdmin = await query(
      'SELECT id FROM admin_users WHERE username = ?',
      ['Admin']
    );

    if (!Array.isArray(existingAdmin) || existingAdmin.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await query(
        'INSERT INTO admin_users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@quantalyze.co.in', hashedPassword, 'admin']
      );
      console.log('[Auth] Default admin user created');
    }
  } catch (error) {
    console.error('[Auth] Failed to initialize admin user:', error);
  }
}

// Authenticate admin user
export async function authenticateAdmin(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    console.log(`[Auth] Attempting authentication for user: ${username}`);
    
    const users = await query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return { success: false, error: 'Invalid username or password' };
    }

    const user = users[0] as AdminUser;
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Update last login
    await query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    console.log(`[Auth] User ${username} authenticated successfully`);
    return { success: true, user };
  } catch (error) {
    console.error('[Auth] Authentication error:', error);
    return { success: false, error: 'Authentication failed. Please check server logs.' };
  }
}

// Generate JWT token
export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): { valid: boolean; user?: any; error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Change admin password
export async function changeAdminPassword(userId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const users = await query(
      'SELECT password FROM admin_users WHERE id = ?',
      [userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const user = users[0] as any;
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE admin_users SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

// Send password reset email (mock implementation - integrate with EmailJS)
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, you would use EmailJS or another email service
    // For now, we'll just return success with the reset token
    // Note: Implement EmailJS integration when email service is configured

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send reset email' };
  }
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request): { authenticated: boolean; user?: any } {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false };
  }

  const token = authHeader.substring(7);
  const verification = verifyToken(token);

  if (verification.valid) {
    return { authenticated: true, user: verification.user };
  }

  return { authenticated: false };
}
