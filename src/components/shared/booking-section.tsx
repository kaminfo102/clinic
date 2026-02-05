'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PersianCalendar } from '@/components/ui/persian-calendar'
import { TimePicker } from '@/components/ui/time-picker'
import { 
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

import { format } from 'date-fns'
import { ServiceItem } from './services-section'

const defaultServices = [
  { id: 1, title: 'لیزر موهای زائد', duration: '60 دقیقه', price: '150,000 تومان' },
  { id: 2, title: 'تزریق ژل', duration: '45 دقیقه', price: '800,000 تومان' },
  { id: 3, title: 'بوتاکس', duration: '30 دقیقه', price: '600,000 تومان' },
  { id: 4, title: 'میکرونیدلینگ', duration: '60 دقیقه', price: '400,000 تومان' },
  { id: 5, title: 'پیلینگ شیمیایی', duration: '45 دقیقه', price: '350,000 تومان' },
  { id: 6, title: 'لیزر CO2', duration: '90 دقیقه', price: '1,200,000 تومان' }
]

export function BookingSection({ data }: { data?: ServiceItem[] }) {
  const services = data && data.length > 0 ? data : defaultServices
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  
  const { user } = useAuth()
  const router = useRouter()

  // Fetch available dates and times when service or date changes
  useEffect(() => {
    if (selectedService) {
      fetchAvailableSlots()
    }
  }, [selectedService, selectedDate])

  const fetchAvailableSlots = async () => {
    try {
      // Use local date format to match DB
      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
      const response = await fetch(`/api/appointments/available?serviceId=${selectedService}&date=${dateStr}`)
      if (response.ok) {
        const data = await response.json()
        setAvailableDates(data.availableDates || [])
        setBookedDates(data.bookedDates || [])
        setAvailableTimes(data.availableTimes || [])
        setBookedTimes(data.bookedTimes || [])
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
    }
  }

  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2)
    } else if (step === 2 && selectedDate && selectedTime) {
      if (user) {
        setStep(3)
      } else {
        // Redirect to login with return URL
        const currentUrl = window.location.href
        const bookingUrl = currentUrl.includes('#booking') ? currentUrl : `${currentUrl}#booking`
        router.push(`/login?redirect=${encodeURIComponent(bookingUrl)}`)
      }
    } else if (step === 3) {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const appointmentData = {
        serviceId: selectedService,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        time: selectedTime,
        notes: formData.notes
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const error = await response.json()
        alert(error.message || 'خطا در ثبت نوبت')
      }
    } catch (error) {
      alert('خطا در ارتباط با سرور')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedService('')
    setSelectedDate(undefined)
    setSelectedTime('')
    setFormData({ name: '', phone: '', email: '', notes: '' })
    setSubmitted(false)
  }

  const getSelectedServiceInfo = () => {
    // services is now data from DB (ServiceItem[])
    // if not provided, falls back to defaultServices
    return services.find(s => s.id.toString() === selectedService)
  }

  const formatPersianDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
  }

  if (submitted) {
    return (
      <section id="booking" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center p-8 border-2 border-green-200 dark:border-green-800">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                نوبت شما با موفقیت ثبت شد!
              </h3>
              <p className="text-muted-foreground mb-6">
                نوبت شما در انتظار تایید نهایی توسط ادمین است. به زودی با شما تماس گرفته خواهد شد.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 mb-6 text-right">
                <div className="space-y-2 text-sm">
                  <div><strong>خدمات:</strong> {getSelectedServiceInfo()?.title}</div>
                  <div><strong>تاریخ:</strong> {formatPersianDate(selectedDate!)}</div>
                  <div><strong>زمان:</strong> {selectedTime}</div>
                  <div><strong>نام:</strong> {user?.name || formData.name}</div>
                  <div><strong>تلفن:</strong> {user?.phone || formData.phone}</div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetForm} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                  ثبت نوبت جدید
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  مشاهده پنل کاربری
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            نوبت دهی آنلاین
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              نوبت خود را رزرو کنید
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            در ۳ ساده نوبت خود را رزرو کنید و از خدمات تخصصی ما بهره‌مند شوید
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      step >= stepNumber
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      stepNumber
                    )}
                  </motion.div>
                  {stepNumber < 3 && (
                    <div className={`w-full h-1 mx-4 transition-all duration-300 ${
                      step > stepNumber ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>انتخاب خدمات</span>
              <span>انتخاب زمان</span>
              <span>تایید نهایی</span>
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
          <Card className="p-4 sm:p-6 md:p-8">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6 sm:mb-8">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 mx-auto mb-3" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">خدمات مورد نظر را انتخاب کنید</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">خدماتی که می‌خواهید دریافت کنید را انتخاب نمایید</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {services.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 border-2 ${
                            selectedService === service.id.toString()
                              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/10 ring-2 ring-rose-200'
                              : 'border-gray-200 dark:border-gray-700 hover:border-rose-300'
                          }`}
                          onClick={() => setSelectedService(service.id.toString())}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-base sm:text-lg">{service.title}</h4>
                              {service.category && (
                                <Badge variant="secondary" className="text-xs sm:text-sm">{service.category}</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>مدت زمان</span>
                              </div>
                              <span className="font-medium text-sm">{service.duration}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time Selection */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 mx-auto mb-3" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">تاریخ و زمان را انتخاب کنید</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">زمان مناسب برای دریافت خدمات را انتخاب نمایید</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Persian Calendar */}
                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-3 sm:mb-4 block">تاریخ نوبت</Label>
                      <PersianCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        availableDates={availableDates}
                        bookedDates={bookedDates}
                        minDate={new Date()}
                        enforceAvailability={true}
                      />
                    </div>

                    {/* Time Picker */}
                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-3 sm:mb-4 block">ساعت نوبت</Label>
                      <TimePicker
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                        availableTimes={availableTimes}
                        bookedTimes={bookedTimes}
                        workingHours={{ startTime: '09:00', endTime: '20:00' }}
                        interval={30}
                      />
                    </div>
                  </div>

                  {/* Selected Service Info */}
                  {selectedService && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">خدمت انتخاب شده:</h4>
                          <p className="text-rose-600 dark:text-rose-400">{getSelectedServiceInfo()?.title}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                          تغییر
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <CheckCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">تایید اطلاعات نوبت</h3>
                    <p className="text-muted-foreground">اطلاعات نوبت خود را بررسی و تایید کنید</p>
                  </div>

                  {/* User Info */}
                  <div className="bg-muted/50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">اطلاعات شما</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>نام و نام خانوادگی</Label>
                        <p className="font-medium">{user?.name || formData.name}</p>
                      </div>
                      <div>
                        <Label>شماره تماس</Label>
                        <p className="font-medium">{user?.phone || formData.phone}</p>
                      </div>
                      <div>
                        <Label>ایمیل</Label>
                        <p className="font-medium">{user?.email || formData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Summary */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">خلاصه نوبت</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>خدمات:</span>
                        <span className="font-medium">{getSelectedServiceInfo()?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>تاریخ:</span>
                        <span className="font-medium">{formatPersianDate(selectedDate!)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>زمان:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">توضیحات اضافی</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="توضیحات اضافی یا سوالات خود را اینجا بنویسید"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse md:flex-row justify-between gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="px-6 py-2 rounded-full w-full md:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  مرحله قبل
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedService) ||
                    (step === 2 && (!selectedDate || !selectedTime)) ||
                    isSubmitting
                  }
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 px-6 py-2 rounded-full w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ثبت...
                    </div>
                  ) : step === 3 ? (
                    'ثبت نهایی نوبت'
                  ) : (
                    <>
                      مرحله بعد
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="text-center p-6">
              <Phone className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">تماس تلفنی</h4>
              <p className="text-sm text-muted-foreground">۰۲۱-۸۸۰۰۰۰۰۰</p>
              <p className="text-xs text-muted-foreground">شنبه تا چهارشنبه ۹-۲۰</p>
            </Card>
            <Card className="text-center p-6">
              <Mail className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">ایمیل</h4>
              <p className="text-sm text-muted-foreground">info@samaraclinic.ir</p>
              <p className="text-xs text-muted-foreground">پاسخ در ۲۴ ساعت</p>
            </Card>
            <Card className="text-center p-6">
              <MapPin className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">آدرس</h4>
              <p className="text-sm text-muted-foreground">تهران، بلوار آفریقا</p>
              <p className="text-xs text-muted-foreground">نلسون ماندلا، پلاک ۱۲</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
