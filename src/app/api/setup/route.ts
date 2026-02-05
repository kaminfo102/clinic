import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@samaraclinic.ir',
        name: 'مدیر کلینیک',
        phone: '09123456789',
        role: 'ADMIN',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e' // password: admin123
      }
    });

    // Create sample services
    const services = [
      {
        title: 'لیزر موهای زائد',
        description: 'حذف دائمی موهای زائد با دستگاه الیت + و آلکساندرایت',
        duration: 60,
        price: 150000,
        category: 'لیزر',
        image: '/images/laser-hair-removal.jpg'
      },
      {
        title: 'تزریق ژل و فیلر',
        description: 'جوانسازی و حجم‌دهی صورت با بهترین برندهای ژل',
        duration: 45,
        price: 800000,
        category: 'تزریقات',
        image: '/images/filler-injection.jpg'
      },
      {
        title: 'بوتاکس',
        description: 'رفع چین و چروک با تزریق بوتاکس اصلی',
        duration: 30,
        price: 600000,
        category: 'تزریقات',
        image: '/images/botox.jpg'
      },
      {
        title: 'میکرونیدلینگ',
        description: 'جوانسازی پوست و درمان اسکار و لک',
        duration: 60,
        price: 400000,
        category: 'جوانسازی',
        image: '/images/microneedling.jpg'
      },
      {
        title: 'پیلینگ شیمیایی',
        description: 'لایه برداری عمیق پوست و درمان لک',
        duration: 45,
        price: 350000,
        category: 'جوانسازی',
        image: '/images/chemical-peeling.jpg'
      },
      {
        title: 'لیزر CO2 فرکشنال',
        description: 'جوانسازی قوی پوست و درمان اسکار',
        duration: 90,
        price: 1200000,
        category: 'لیزر',
        image: '/images/co2-laser.jpg'
      }
    ];

    for (const service of services) {
      await db.service.create({
        data: service
      });
    }

    return NextResponse.json({
      message: 'Database setup completed successfully',
      admin: {
        email: admin.email,
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup database' },
      { status: 500 }
    );
  }
}