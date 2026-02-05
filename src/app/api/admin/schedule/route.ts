import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get working hours
    const workingHours = await db.workingHour.findMany({
      orderBy: { dayOfWeek: 'asc' }
    });

    // Get time slots
    const timeSlots = await db.timeSlot.findMany({
      include: {
        service: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    return NextResponse.json({
      workingHours,
      timeSlots
    });

  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, data } = await request.json();

    if (type === 'workingHour') {
      // Add or update working hour
      const { dayOfWeek, startTime, endTime, isActive } = data;
      
      const workingHour = await db.workingHour.upsert({
        where: { dayOfWeek },
        update: { startTime, endTime, isActive },
        create: { dayOfWeek, startTime, endTime, isActive }
      });

      return NextResponse.json(workingHour);
    } else if (type === 'timeSlot') {
      // Add time slot
      const { date, time, serviceId, isAvailable } = data;
      
      const timeSlot = await db.timeSlot.create({
        data: {
          date,
          time,
          serviceId,
          isAvailable
        }
      });

      return NextResponse.json(timeSlot);
    } else if (type === 'bulkTimeSlots') {
      const { startDate, endDate, serviceId, workingHours, interval } = data;
      const slotInterval = typeof interval === 'number' && interval > 0 ? interval : 30;
      const timeSlots: Array<{ date: string; time: string; serviceId?: string | null; isAvailable: boolean }> = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      const loopDate = new Date(start);
      while (loopDate <= end) {
        const jsDay = loopDate.getDay();
        const dbDay = (jsDay + 1) % 7;
        const workingHour = workingHours.find((wh: any) => wh.dayOfWeek === dbDay);
        const startTimeStr = (workingHour && workingHour.isActive) ? workingHour.startTime : '09:00';
        const endTimeStr = (workingHour && workingHour.isActive) ? workingHour.endTime : '20:00';
        {
          const [startHour, startMinute] = startTimeStr.split(':').map(Number);
          const [endHour, endMinute] = endTimeStr.split(':').map(Number);
          let currentMinutes = startHour * 60 + startMinute;
          const endMinutes = endHour * 60 + endMinute;
          const dateStr = format(loopDate, 'yyyy-MM-dd');
          while (currentMinutes < endMinutes) {
            const hour = Math.floor(currentMinutes / 60);
            const minute = currentMinutes % 60;
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            timeSlots.push({
              date: dateStr,
              time: timeString,
              serviceId,
              isAvailable: true
            });
            currentMinutes += slotInterval;
          }
        }
        loopDate.setDate(loopDate.getDate() + 1);
      }
      // Deduplicate against existing slots (SQLite Prisma v7 doesn't support skipDuplicates)
      const existing = await db.timeSlot.findMany({
        where: {
          date: {
            gte: format(start, 'yyyy-MM-dd'),
            lte: format(end, 'yyyy-MM-dd')
          }
        },
        select: { date: true, time: true }
      });
      const existingSet = new Set(existing.map(e => `${e.date}|${e.time}`));
      const newSlots = timeSlots.filter(s => !existingSet.has(`${s.date}|${s.time}`));
      let createdSlots: { count: number } = { count: 0 };
      if (newSlots.length > 0) {
        createdSlots = await db.timeSlot.createMany({
          data: newSlots
        });
      }

      return NextResponse.json({ created: createdSlots.count });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, id } = await request.json();

    if (type === 'timeSlot') {
      await db.timeSlot.delete({
        where: { id }
      });
    } else if (type === 'workingHour') {
      await db.workingHour.delete({
        where: { id }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule item' },
      { status: 500 }
    );
  }
}
