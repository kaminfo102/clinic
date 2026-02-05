'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  Navigation,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react'
import { motion } from 'framer-motion'

const contactInfo = [
  {
    icon: MapPin,
    title: 'آدرس کلینیک',
    content: 'تهران، بلوار آفریقا، خیابان نلسون ماندلا، پلاک ۱۲، طبقه سوم',
    detail: 'روبروی بیمارستان لبافی نژاد'
  },
  {
    icon: Phone,
    title: 'شماره تماس',
    content: '۰۲۱-۸۸۰۰۰۰۰۰',
    detail: 'شنبه تا چهارشنبه: ۹ الی ۲۰'
  },
  {
    icon: Mail,
    title: 'ایمیل',
    content: 'info@samaraclinic.ir',
    detail: 'پاسخ در ۲۴ ساعت کاری'
  },
  {
    icon: Clock,
    title: 'ساعات کاری',
    content: 'شنبه تا چهارشنبه: ۹:۰۰ - ۲۰:۰۰',
    detail: 'پنج‌شنبه: ۹:۰۰ - ۱۶:۰۰'
  }
]

const socialLinks = [
  { icon: Instagram, href: '#', name: 'اینستاگرام' },
  { icon: Facebook, href: '#', name: 'فیسبوک' },
  { icon: Twitter, href: '#', name: 'توییتر' }
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    
    // Reset submitted state after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/30">
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
            تماس با ما
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              با ما در ارتباط باشید
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            برای مشاوره رایگان یا سوالات خود می‌توانید با ما تماس بگیرید یا فرم زیر را تکمیل کنید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">اطلاعات تماس</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="text-right">
                              <h4 className="font-semibold mb-1">{info.title}</h4>
                              <p className="text-sm text-foreground">{info.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{info.detail}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-rose-500" />
                    موقعیت مکانی
                  </CardTitle>
                  <CardDescription>
                    برای مشاهده مسیر دسترسی روی نقشه کلیک کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-rose-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">نقشه گوگل</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        مشاهده در نقشه
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>شبکه‌های اجتماعی</CardTitle>
                  <CardDescription>
                    ما را در شبکه‌های اجتماعی دنبال کنید
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/20"
                        >
                          <Icon className="w-5 h-5" />
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-500" />
                  ارسال پیام
                </CardTitle>
                <CardDescription>
                  فرم زیر را تکمیل کنید و در اسرع وقت با شما تماس خواهیم گرفت
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                      پیام شما با موفقیت ارسال شد!
                    </h3>
                    <p className="text-muted-foreground">
                      به زودی با شما تماس خواهیم گرفت
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">نام و نام خانوادگی *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="نام کامل خود را وارد کنید"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">ایمیل</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@email.com"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">شماره موبایل *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">موضوع پیام *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="موضوع پیام خود را وارد کنید"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">متن پیام *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="پیام خود را اینجا بنویسید..."
                        rows={5}
                        required
                        className="mt-2 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 py-3 rounded-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          در حال ارسال...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          ارسال پیام
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">سوالات متداول</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              پاسخ سوالات پرتکرار شما را در اینجا جمع‌آوری کرده‌ایم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: 'آیا برای مشاوره هزینه ای دریافت می‌شود؟',
                a: 'خیر، مشاوره اولیه کاملاً رایگان است.'
              },
              {
                q: 'آیا خدمات بیمه تکمیلی پوشش داده می‌شود؟',
                a: 'بله، بسیاری از خدمات تحت پوشش بیمه‌های تکمیلی هستند.'
              },
              {
                q: 'چه مدت بعد از تزریق می‌توانم فعالیت کنم؟',
                a: 'معمولاً بعد از ۲۴ ساعت می‌توانید فعالیت‌های عادی را از سر بگیرید.'
              },
              {
                q: 'آیا لیزر برای پوست‌های تیره مناسب است؟',
                a: 'بله، با دستگاه‌های جدید ما لیزر برای انواع پوست مناسب است.'
              },
              {
                q: 'چقدر طول می‌کشد تا نتایج دیده شود؟',
                a: 'بسته به نوع خدمات، نتایج معمولاً از ۱ هفته تا ۱ ماه دیده می‌شود.'
              },
              {
                q: 'آیا عوارض جانبی دارد؟',
                a: 'عوارض جانبی موقتی و جزئی مانند قرمزی و تورم طبیعی است.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3 text-rose-600 dark:text-rose-400">
                      {faq.q}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}