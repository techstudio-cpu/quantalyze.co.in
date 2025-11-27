import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, testFallbackConnection } from '@/lib/fallback-db';

// Check if we should use fallback (MySQL connection issues)
let useFallback = false;
let fallbackChecked = false;

async function checkFallback() {
  if (!fallbackChecked) {
    try {
      await query('SELECT 1');
      useFallback = false;
    } catch (error) {
      console.log('MySQL not available, using SQLite fallback');
      useFallback = true;
      await testFallbackConnection();
    }
    fallbackChecked = true;
  }
  return useFallback;
}

// GET /api/admin/team - Fetch all team members
export async function GET() {
  try {
    await checkFallback();

    const teamMembers = useFallback
      ? await fallbackQuery(
          'SELECT * FROM team_members ORDER BY joined_at DESC'
        )
      : await query(
          'SELECT * FROM team_members ORDER BY joined_at DESC'
        );

    return NextResponse.json({
      success: true,
      data: teamMembers,
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch team members',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// POST /api/admin/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    await checkFallback();

    const body = await request.json();
    const { name, email, role, department, bio, avatar, status = 'active' } = body;

    if (!name || !email || !role || !department || !bio) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, role, department, and bio are required'
      }, { status: 400 });
    }

    const result = useFallback
      ? await fallbackQuery(
          `INSERT INTO team_members (name, email, role, department, bio, avatar, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, email, role, department, bio, avatar || null, status]
        )
      : await query(
          `INSERT INTO team_members (name, email, role, department, bio, avatar, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [name, email, role, department, bio, avatar || null, status]
        );

    return NextResponse.json({
      success: true,
      message: 'Team member created successfully',
      data: {
        id: Array.isArray(result) ? result[0]?.insertId : result?.insertId,
        ...body
      },
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create team member',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// PATCH /api/admin/team - Update team member
export async function PATCH(request: NextRequest) {
  try {
    await checkFallback();

    const { id, name, email, role, department, bio, avatar, status } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Team member ID is required'
      }, { status: 400 });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (department !== undefined) {
      updateFields.push('department = ?');
      updateValues.push(department);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update'
      }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const updateQuery = `UPDATE team_members SET ${updateFields.join(', ')} WHERE id = ?`;

    if (useFallback) {
      await fallbackQuery(updateQuery, updateValues);
    } else {
      await query(updateQuery, updateValues);
    }

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update team member',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}

// DELETE /api/admin/team - Delete team member
export async function DELETE(request: NextRequest) {
  try {
    await checkFallback();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Team member ID is required'
      }, { status: 400 });
    }
    
    if (useFallback) {
      await fallbackQuery('DELETE FROM team_members WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM team_members WHERE id = ?', [id]);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    });
    
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete team member',
      database: useFallback ? 'SQLite (Local)' : 'MySQL (Remote)'
    }, { status: 500 });
  }
}
