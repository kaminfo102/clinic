import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const selectedDate = searchParams.get('date'); // YYYY-MM-DD

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Date range for calendar (30 days)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    const startDateStr = format(today, 'yyyy-MM-dd');
    const endDateStr = format(endDate, 'yyyy-MM-dd');

    // Get working hours
    const workingHours = await db.workingHour.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: 'asc' }
    });

    // Get time slots for the date range
    // We want slots that are either for this service specifically OR general slots (null)
    const timeSlots = await db.timeSlot.findMany({
      where: { 
        date: {
          gte: startDateStr,
          lte: endDateStr
        },
        OR: [
          { serviceId: serviceId },
          { serviceId: null }
        ]
      },
      orderBy: { time: 'asc' }
    });

    // Get existing appointments for the date range
    const appointments = await db.appointment.findMany({
      where: { 
        date: {
          gte: startDateStr,
          lte: endDateStr
        },
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    // Generate available/booked dates lists
    const availableDates = [];
    const bookedDates = [];
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      
      // Filter slots and appointments for this specific date
      const daySlots = timeSlots.filter(slot => slot.date === dateStr);
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
      
      // If there are no slots created by admin, the day is NOT available
      if (daySlots.length === 0) {
        continue; 
      }

      // Check capacity
      // A slot is available if it's not booked
      // But wait, slots are specific times.
      // We need to count how many slots are effectively available.
      
      let availableCount = 0;
      daySlots.forEach(slot => {
        // Is this specific slot booked?
        // Check if there is an appointment for this service (or any service if slot is generic? No, slot is consumed)
        // Appointment has time and date.
        const isBooked = dayAppointments.some(apt => apt.time === slot.time);
        if (!isBooked && slot.isAvailable) {
          availableCount++;
        }
      });

      if (availableCount > 0) {
        (availableDates as string[]).push(dateStr);
      } else {
        // If there were slots but all are booked
(bookedDates as string[]).push(dateStr);
      }
    }

    // Generate available times for the SELECTED date
    const availableTimes = [];
    const bookedTimes = [];
    
    if (selectedDate) {
      const selectedDaySlots = timeSlots.filter(slot => slot.date === selectedDate);
      const selectedDayAppointments = appointments.filter(apt => apt.date === selectedDate);
      
      selectedDaySlots.forEach(slot => {
        const isBooked = selectedDayAppointments.some(apt => apt.time === slot.time);
        if (isBooked) {
          (bookedTimes as string[]).push(slot.time);
        } else if (slot.isAvailable) {
          (availableTimes as string[]).push(slot.time);
        }
      });
    }

    return NextResponse.json({
      availableDates,
      bookedDates,
      availableTimes,
      bookedTimes,
      workingHours
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
