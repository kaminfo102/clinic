import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Create admin user with known password
    const adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminUser) {
      // Update password to known value
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await db.user.update({
        where: { id: adminUser.id },
        data: { password: hashedPassword }
      });
      
      return NextResponse.json({
        message: 'Admin password updated successfully',
        email: adminUser.email,
        password: 'admin123'
      });
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const user = await db.user.create({
        data: {
          email: 'admin@samaraclinic.ir',
          name: 'مدیر کلینیک',
          phone: '09123456789',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      return NextResponse.json({
        message: 'Admin user created successfully',
        email: user.email,
        password: 'admin123'
      });
    }

  } catch (error) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin password' },
      { status: 500 }
    );
  }
}