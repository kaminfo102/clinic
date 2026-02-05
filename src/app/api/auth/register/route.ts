import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : undefined;
    const password = typeof body?.password === 'string' ? body.password : undefined;
    const name = typeof body?.name === 'string' ? body.name : undefined;
    const phone = typeof body?.phone === 'string' ? body.phone : undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور الزامی هستند' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Register: checking existing user for', email);
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'کاربری با این ایمیل قبلاً ثبت نام کرده است' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Register: hashing password');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log('Register: creating user');
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'USER'
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'ثبت نام با موفقیت انجام شد',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'خطا در ثبت نام', details: message },
      { status: 500 }
    );
  }
}
