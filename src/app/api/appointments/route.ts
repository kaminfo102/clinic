import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'کاربر وارد نشده است' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'توکن نامعتبر است' },
        { status: 401 }
      );
    }

    const { serviceId, date, time, notes } = await request.json();

    if (!serviceId || !date || !time) {
      return NextResponse.json(
        { error: 'خدمات، تاریخ و زمان الزامی هستند' },
        { status: 400 }
      );
    }

    // Check if service exists
    const service = await db.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'خدمات مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    // Check if time slot exists in admin schedule
    console.log('Searching for TimeSlot with:', { date, time, serviceId });
    
    // Debug: Find ANY slot on this date
    const allSlotsOnDate = await db.timeSlot.findMany({
      where: { date }
    });
    console.log('All slots on this date:', allSlotsOnDate);

    const timeSlot = await db.timeSlot.findFirst({
      where: {
        date,
        time,
        OR: [
          { serviceId: serviceId },
          { serviceId: null }
        ],
        isAvailable: true
      }
    });

    if (!timeSlot) {
      console.log('TimeSlot not found');
      return NextResponse.json(
        { error: 'این زمان در برنامه کاری وجود ندارد' },
        { status: 404 }
      );
    }

    // Check if time slot is already booked
    const existingAppointment = await db.appointment.findFirst({
      where: {
        // We check if ANY appointment exists for this time/date, not just for this service
        // because the slot is consumed.
        // Wait, if slot is generic (serviceId=null), it can be used for any service.
        // Once booked, is it gone? Yes.
        date,
        time,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'این زمان قبلاً رزرو شده است' },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await db.appointment.create({
      data: {
        userId: decoded.userId,
        serviceId,
        timeSlotId: timeSlot.id,
        date,
        time,
        notes,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: true
      }
    });

    return NextResponse.json({
      message: 'نوبت با موفقیت ثبت شد',
      appointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت نوبت' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'کاربر وارد نشده است' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'توکن نامعتبر است' },
        { status: 401 }
      );
    }

    // Get user's appointments
    const appointments = await db.appointment.findMany({
      where: { userId: decoded.userId },
      include: {
        service: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ appointments });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت نوبت‌ها' },
      { status: 500 }
    );
  }
}