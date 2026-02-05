import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting schedule initialization...');
    
    // Create default working hours
    const workingHours = [
      { dayOfWeek: 0, startTime: '09:00', endTime: '20:00', isActive: true }, // Saturday
      { dayOfWeek: 1, startTime: '09:00', endTime: '20:00', isActive: true }, // Sunday
      { dayOfWeek: 2, startTime: '09:00', endTime: '20:00', isActive: true }, // Monday
      { dayOfWeek: 3, startTime: '09:00', endTime: '20:00', isActive: true }, // Tuesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '20:00', isActive: true }, // Wednesday
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isActive: true }, // Thursday
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00', isActive: true }, // Friday
    ];

    console.log('Creating working hours...');
    for (const wh of workingHours) {
      try {
        await db.workingHour.upsert({
          where: { dayOfWeek: wh.dayOfWeek },
          update: wh,
          create: wh
        });
        console.log(`Created working hour for day ${wh.dayOfWeek}`);
      } catch (error) {
        console.error(`Error creating working hour for day ${wh.dayOfWeek}:`, error);
      }
    }

    console.log('Working hours created successfully');

    // Generate time slots for the next 30 days
    const today = new Date();
    const timeSlots = [];

    console.log('Generating time slots...');
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      const workingHour = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
      
      if (workingHour && workingHour.isActive) {
        const [startHour, startMinute] = workingHour.startTime.split(':').map(Number);
        const [endHour, endMinute] = workingHour.endTime.split(':').map(Number);
        
        let currentMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        while (currentMinutes < endMinutes) {
          const hour = Math.floor(currentMinutes / 60);
          const minute = currentMinutes % 60;
          const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          
          timeSlots.push({
            date: currentDate.toISOString().split('T')[0],
            time: timeString,
            isAvailable: true
          });
          
          currentMinutes += 30; // 30-minute intervals
        }
      }
    }

    console.log(`Generated ${timeSlots.length} time slots`);

    // Insert time slots in batches
    const batchSize = 100;
    let createdCount = 0;
    
    for (let i = 0; i < timeSlots.length; i += batchSize) {
      const batch = timeSlots.slice(i, i + batchSize);
      try {
        const result = await db.timeSlot.createMany({
          data: batch,
          skipDuplicates: true
        });
        createdCount += result.count;
        console.log(`Created batch ${Math.floor(i/batchSize) + 1}, total created: ${createdCount}`);
      } catch (error) {
        console.error(`Error creating batch ${Math.floor(i/batchSize) + 1}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Schedule initialized successfully',
      workingHoursCreated: workingHours.length,
      timeSlotsCreated: createdCount
    });

  } catch (error) {
    console.error('Error initializing schedule:', error);
    return NextResponse.json(
      { error: 'Failed to initialize schedule', details: error.message },
      { status: 500 }
    );
  }
}