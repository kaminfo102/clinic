'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { 
  format as formatJalali, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay
} from 'date-fns-jalali'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface PersianCalendarProps {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  availableDates?: string[] // Expected in YYYY-MM-DD Gregorian format
  bookedDates?: string[]   // Expected in YYYY-MM-DD Gregorian format
  minDate?: Date
  maxDate?: Date
  className?: string
  enforceAvailability?: boolean
}

export function PersianCalendar({
  selectedDate,
  onDateSelect,
  availableDates = [],
  bookedDates = [],
  minDate = new Date(),
  maxDate,
  className,
  enforceAvailability = false
}: PersianCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

  // Ensure we're comparing start of days
  const today = startOfDay(new Date())
  const min = minDate ? startOfDay(minDate) : today

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  // Calculate empty cells for the start of the month
  const startDay = startOfMonth(currentMonth).getDay()
  const startDayOffset = (startDay + 1) % 7

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    if (isBefore(date, min)) return
    onDateSelect(date)
  }

  return (
    <div className={`p-2 sm:p-4 bg-background rounded-lg border shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="font-bold text-base sm:text-lg">
          {formatJalali(currentMonth, 'MMMM yyyy')}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs sm:text-sm text-muted-foreground">
        <div>ش</div>
        <div>ی</div>
        <div>د</div>
        <div>س</div>
        <div>چ</div>
        <div>پ</div>
        <div>ج</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map((day) => {
          const dateIso = format(day, 'yyyy-MM-dd')
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isAvailable = availableDates.includes(dateIso)
          const isBooked = bookedDates.includes(dateIso)
          const isDisabled = isBefore(day, min) || (enforceAvailability && !isAvailable)
          
          let variant = "ghost"
          if (isSelected) variant = "default"
          else if (isAvailable) variant = "outline" // Or some other style
          
          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? "default" : "ghost"}
              className={`
                h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal
                ${!isSelected && isToday(day) ? 'border border-primary text-primary' : ''}
                ${isAvailable && !isSelected ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                ${isBooked && !isSelected ? 'bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 opacity-50 cursor-not-allowed dark:bg-red-900/20 dark:text-red-400' : ''}
                ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
              `}
              disabled={isDisabled}
              onClick={() => handleDateClick(day)}
            >
              {formatJalali(day, 'd')}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
