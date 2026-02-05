'use client'

import * as React from 'react'
import { format as formatJalali } from 'date-fns-jalali'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PersianCalendar } from './persian-calendar'

interface PersianDatePickerProps {
  date?: Date
  onSelect: (date: Date) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
}

export function PersianDatePicker({
  date,
  onSelect,
  placeholder = 'انتخاب تاریخ',
  className,
  disabled = false,
  minDate
}: PersianDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (selectedDate: Date) => {
    onSelect(selectedDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-right font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {date ? formatJalali(date, 'yyyy/MM/dd') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <PersianCalendar
          selectedDate={date}
          onDateSelect={handleSelect}
          minDate={minDate}
          className="border-0"
        />
      </PopoverContent>
    </Popover>
  )
}
