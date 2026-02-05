'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Calendar, 
  Clock, 
  Settings, 
  Plus, 
  Trash2, 
  Save,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { PersianCalendar } from '@/components/ui/persian-calendar'
import { PersianDatePicker } from '@/components/ui/persian-date-picker'
import { format } from 'date-fns-jalali'
import { format as formatIso } from 'date-fns'

interface WorkingHour {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

interface TimeSlot {
  id: string
  date: string
  time: string
  isAvailable: boolean
  serviceId?: string
  service?: {
    id: string
    title: string
  }
}

interface Service {
  id: string
  title: string
}

const persianDays = [
  { value: 0, label: 'شنبه' },
  { value: 1, label: 'یکشنبه' },
  { value: 2, label: 'دوشنبه' },
  { value: 3, label: 'سه‌شنبه' },
  { value: 4, label: 'چهارشنبه' },
  { value: 5, label: 'پنج‌شنبه' },
  { value: 6, label: 'جمعه' }
]

export function ScheduleManager() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Date selection state
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date())
  
  // New slot state
  const [newSlotTime, setNewSlotTime] = useState('')
  const [newSlotService, setNewSlotService] = useState('all') // 'all' means available for any service

  // Bulk generation state
  const [bulkStartDate, setBulkStartDate] = useState<Date>()
  const [bulkEndDate, setBulkEndDate] = useState<Date>()
  const [bulkService, setBulkService] = useState('all')
  const [bulkInterval, setBulkInterval] = useState(15)

  useEffect(() => {
    fetchSchedule()
    fetchServices()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/admin/schedule')
      if (response.ok) {
        const data = await response.json()
        setWorkingHours(data.workingHours || [])
        setTimeSlots(data.timeSlots || [])
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleUpdateWorkingHour = async (dayOfWeek: number, field: 'startTime' | 'endTime' | 'isActive', value: string | boolean) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'workingHour',
          data: {
            dayOfWeek,
            [field]: value
          }
        })
      })

      if (response.ok) {
        await fetchSchedule()
      }
    } catch (error) {
      console.error('Error updating working hour:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSlot = async () => {
    if (!newSlotTime) return

    try {
      setSaving(true)
      const dateStr = formatIso(selectedDateObj, 'yyyy-MM-dd')
      
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'timeSlot',
          data: {
            date: dateStr,
            time: newSlotTime,
            serviceId: newSlotService === 'all' ? null : newSlotService,
            isAvailable: true
          }
        })
      })

      if (response.ok) {
        await fetchSchedule()
        setNewSlotTime('')
      }
    } catch (error) {
      console.error('Error adding slot:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm('آیا از حذف این بازه زمانی اطمینان دارید؟')) return
    
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'timeSlot',
          id
        })
      })

      if (response.ok) {
        await fetchSchedule()
      }
    } catch (error) {
      console.error('Error deleting time slot:', error)
    }
  }

  const handleGenerateBulkTimeSlots = async () => {
    if (!bulkStartDate || !bulkEndDate) {
      alert('لطفاً تاریخ شروع و پایان را انتخاب کنید')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bulkTimeSlots',
          data: {
            startDate: formatIso(bulkStartDate, 'yyyy-MM-dd'),
            endDate: formatIso(bulkEndDate, 'yyyy-MM-dd'),
            serviceId: bulkService === 'all' ? null : bulkService,
            workingHours,
            interval: bulkInterval
          }
        })
      })

      if (response.ok) {
        const resJson = await response.json()
        await fetchSchedule()
        const createdCount = resJson?.created ?? 0
        if (createdCount > 0) {
          alert(`نوبت‌ها با موفقیت ایجاد شدند (${createdCount})`)
        } else {
          alert('هیچ نوبتی ایجاد نشد. ممکن است در این بازه ساعات کاری فعال نباشد یا نوبت‌ها موجود باشند.')
        }
        setBulkStartDate(undefined)
        setBulkEndDate(undefined)
      }
    } catch (error) {
      console.error('Error generating bulk time slots:', error)
    } finally {
      setSaving(false)
    }
  }

  const getDayLabel = (dayOfWeek: number) => {
    return persianDays.find(day => day.value === dayOfWeek)?.label || ''
  }

  // Filter slots for selected date
  const selectedDateStr = format(selectedDateObj, 'yyyy/MM/dd')
  const slotsForDate = timeSlots.filter(slot => slot.date === formatIso(selectedDateObj, 'yyyy-MM-dd'))

  // Get dates that have slots
  const datesWithSlots = Array.from(new Set(timeSlots.map(slot => slot.date)))

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-8">
      {/* 1. Working Hours Configuration (Template) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            تنظیم ساعات کاری (الگو)
          </CardTitle>
          <CardDescription>
            این ساعات برای تولید انبوه نوبت‌ها استفاده می‌شوند
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workingHours.map((wh) => (
              <div key={wh.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-24 font-medium">{getDayLabel(wh.dayOfWeek)}</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={wh.startTime}
                    onChange={(e) => handleUpdateWorkingHour(wh.dayOfWeek, 'startTime', e.target.value)}
                    disabled={!wh.isActive}
                    className="w-32"
                  />
                  <span>تا</span>
                  <Input
                    type="time"
                    value={wh.endTime}
                    onChange={(e) => handleUpdateWorkingHour(wh.dayOfWeek, 'endTime', e.target.value)}
                    disabled={!wh.isActive}
                    className="w-32"
                  />
                </div>
                <div className="flex-1" />
                <Switch
                  checked={wh.isActive}
                  onCheckedChange={(checked) => handleUpdateWorkingHour(wh.dayOfWeek, 'isActive', checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Calendar & Slot Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                مدیریت تقویم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PersianCalendar
                selectedDate={selectedDateObj}
                onDateSelect={setSelectedDateObj}
                availableDates={datesWithSlots}
                className="mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                افزودن نوبت تکی
              </CardTitle>
              <CardDescription>
                برای تاریخ: {selectedDateStr}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ساعت</Label>
                  <Input 
                    type="time" 
                    value={newSlotTime} 
                    onChange={(e) => setNewSlotTime(e.target.value)} 
                  />
                </div>
                <div>
                  <Label>خدمت (اختیاری)</Label>
                  <Select value={newSlotService} onValueChange={setNewSlotService}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه خدمات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه خدمات</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddSlot} disabled={!newSlotTime || saving} className="w-full">
                افزودن نوبت
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 3. Slots List & Bulk Generation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>نوبت‌های {selectedDateStr}</CardTitle>
            </CardHeader>
            <CardContent>
              {slotsForDate.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  نوبتی برای این تاریخ تعریف نشده است
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {slotsForDate.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{slot.time}</Badge>
                        <span className="text-sm">
                          {slot.service ? slot.service.title : 'همه خدمات'}
                        </span>
                        {!slot.isAvailable && (
                          <Badge variant="secondary" className="text-xs">رزرو شده</Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تولید انبوه نوبت</CardTitle>
              <CardDescription>
                ایجاد نوبت برای بازه زمانی بر اساس ساعات کاری
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">از تاریخ</Label>
                  <PersianDatePicker
                    date={bulkStartDate}
                    onSelect={setBulkStartDate}
                    placeholder="انتخاب تاریخ"
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">تا تاریخ</Label>
                  <PersianDatePicker
                    date={bulkEndDate}
                    onSelect={setBulkEndDate}
                    placeholder="انتخاب تاریخ"
                    minDate={bulkStartDate || new Date()}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>خدمت</Label>
                  <Select value={bulkService} onValueChange={setBulkService}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه خدمات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه خدمات</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>فاصله زمانی (دقیقه)</Label>
                  <Select value={bulkInterval.toString()} onValueChange={(v) => setBulkInterval(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب فاصله" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">۱۵</SelectItem>
                      <SelectItem value="30">۳۰</SelectItem>
                      <SelectItem value="45">۴۵</SelectItem>
                      <SelectItem value="60">۶۰</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Button onClick={handleGenerateBulkTimeSlots} disabled={saving || !bulkStartDate || !bulkEndDate} className="w-full mt-2">
                  تولید نوبت‌ها
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
