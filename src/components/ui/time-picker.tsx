'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface TimePickerProps {
  selectedTime?: string
  onTimeSelect: (time: string) => void
  availableTimes?: string[]
  bookedTimes?: string[]
  workingHours?: {
    startTime: string
    endTime: string
  }
  interval?: number // minutes between slots
}

export function TimePicker({
  selectedTime,
  onTimeSelect,
  availableTimes = [],
  bookedTimes = [],
  workingHours = { startTime: '09:00', endTime: '20:00' },
  interval = 30
}: TimePickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning')

  // Generate time slots based on working hours
  const generateTimeSlots = (): string[] => {
    const slots: string[] = []
    const [startHour, startMinute] = workingHours.startTime.split(':').map(Number)
    const [endHour, endMinute] = workingHours.endTime.split(':').map(Number)
    
    let currentMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    
    while (currentMinutes < endMinutes) {
      const hour = Math.floor(currentMinutes / 60)
      const minute = currentMinutes % 60
      const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      slots.push(timeString)

      currentMinutes += interval
    }
    
    return slots
  }

  const allTimeSlots = generateTimeSlots()

  const categorizeTime = (time: string) => {
    const [hour] = time.split(':').map(Number)
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  const getTimeSlotsByPeriod = (period: 'morning' | 'afternoon' | 'evening') => {
    return allTimeSlots.filter(time => categorizeTime(time) === period)
  }

  const isTimeAvailable = (time: string) => {
    return availableTimes.includes(time)
  }

  const isTimeBooked = (time: string) => {
    return bookedTimes.includes(time)
  }

  const getTimeStatus = (time: string) => {
    if (isTimeBooked(time)) return 'booked'
    if (isTimeAvailable(time)) return 'available'
    return 'unavailable'
  }

  const getTimeLabel = (period: 'morning' | 'afternoon' | 'evening') => {
    switch (period) {
      case 'morning': return 'صبح'
      case 'afternoon': return 'بعد از ظهر'
      case 'evening': return 'عصر'
    }
  }

  const getTimeIcon = (period: 'morning' | 'afternoon' | 'evening') => {
    switch (period) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌆'
    }
  }

  const periods: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening']

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-3 sm:p-6">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">انتخاب زمان</h3>
          <p className="text-sm text-muted-foreground">
            ساعات کاری: {workingHours.startTime} تا {workingHours.endTime}
          </p>
        </div>

        {/* Period Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-muted rounded-lg p-1 flex gap-1">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2"
              >
                <span>{getTimeIcon(period)}</span>
                <span>{getTimeLabel(period)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {getTimeSlotsByPeriod(selectedPeriod).map((time) => {
            const status = getTimeStatus(time)
            const isSelected = selectedTime === time
            
            return (
              <motion.div
                key={time}
                whileHover={{ scale: status !== 'booked' ? 1.05 : 1 }}
                whileTap={{ scale: status !== 'booked' ? 0.95 : 1 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-full h-10 sm:h-12 p-0 relative overflow-hidden transition-all duration-200 ${
                    status === 'booked' 
                      ? 'bg-red-50 border-red-200 text-red-600 cursor-not-allowed opacity-60' 
                      : status === 'available'
                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                      : 'bg-muted/20 text-muted-foreground opacity-50 cursor-not-allowed'
                  } ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => status === 'available' && onTimeSelect(time)}
                  disabled={status !== 'available'}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <Clock className="w-3 h-3 mb-1" />
                    <span className="text-xs font-medium">{time}</span>
                    
                    {/* Status indicator */}
                    {status === 'booked' && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                    )}
                    {status === 'available' && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>موجود</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>رزرو شده</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
            <span>غیرفعال</span>
          </div>
        </div>

        {/* Selected Time Display */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-primary/10 rounded-lg text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">زمان انتخاب شده:</span>
              <Badge variant="secondary" className="text-base sm:text-lg px-3 py-1">
                {selectedTime}
              </Badge>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
