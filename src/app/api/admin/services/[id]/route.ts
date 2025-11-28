import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { fallbackQuery, fallbackRun, testFallbackConnection } from '@/lib/fallback-db';

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

// PATCH /api/admin/services/[id] - Update a single service
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkFallback();

    const id = params.id;
    const { name, tagline, icon, href, subServices, order, price } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required',
      }, { status: 400 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(name);
    }
    if (tagline !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(tagline);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }
    if (href !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(href);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (order !== undefined) {
      updateFields.push('featured = ?');
      updateValues.push(order);
    }
    if (subServices !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(JSON.stringify(subServices));
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No fields to update',
      }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const sql = `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`;

    if (useFallback) {
      await fallbackRun(sql, updateValues);
    } else {
      await query(sql, updateValues);
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update service',
    }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id] - Delete a single service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkFallback();
    const id = params.id;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Service ID is required',
      }, { status: 400 });
    }

    const sql = 'DELETE FROM services WHERE id = ?';

    if (useFallback) {
      await fallbackRun(sql, [id]);
    } else {
      await query(sql, [id]);
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete service',
    }, { status: 500 });
  }
}
