import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic database connection
    const userCount = await db.user.count();
    console.log('User count:', userCount);
    
    const serviceCount = await db.service.count();
    console.log('Service count:', serviceCount);
    
    const workingHourCount = await db.workingHour.count();
    console.log('WorkingHour count:', workingHourCount);
    
    const timeSlotCount = await db.timeSlot.count();
    console.log('TimeSlot count:', timeSlotCount);
    
    const appointmentCount = await db.appointment.count();
    console.log('Appointment count:', appointmentCount);
    
    return NextResponse.json({
      message: 'Database connection test successful',
      envUrl: process.env.DATABASE_URL || null,
      userCount,
      serviceCount,
      workingHourCount,
      timeSlotCount,
      appointmentCount,
      dbConnected: true
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : String(error), envUrl: process.env.DATABASE_URL || null },
      { status: 500 }
    );
  }
}
