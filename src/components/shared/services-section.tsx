'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Users, 
  Star, 
  Heart,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  ArrowLeft,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export interface ServiceItem {
  id: string | number
  title: string
  description: string
  longDescription?: string
  category: string | null
  price: string
  duration: string
  sessions?: string
  rating?: number
  reviews?: number
  image?: string | null
  icon?: any
  features?: string[]
  popular?: boolean
  badge?: string
}

const defaultServices: ServiceItem[] = [
  {
    id: 1,
    title: 'لیزر موهای زائد',
    description: 'حذف دائمی موهای زائد با دستگاه‌های پیشرفته الیت + و آلکساندرایت',
    longDescription: 'با استفاده از جدیدترین نسل دستگاه‌های لیزر، موهای زائد را برای همیشه از بین ببرید. دستگاه الیت + با تکنولوژی سه طول موج، مناسب انواع پوست و مو.',
    category: 'لیزر',
    price: 'شروع از ۱۵۰,۰۰۰ تومان',
    duration: '۳۰-۶۰ دقیقه',
    sessions: '۶-۸ جلسه',
    rating: 4.9,
    reviews: 245,
    image: '/api/placeholder/400/300',
    icon: Zap,
    features: ['مناسب انواع پوست', 'بدون درد', 'نتایج دائمی', 'دستگاه الیت +'],
    popular: true,
    badge: 'پرفروش‌ترین'
  },
  {
    id: 2,
    title: 'تزریق ژل و فیلر',
    description: 'جوانسازی و حجم‌دهی صورت با بهترین برندهای ژل اروپایی و کره‌ای',
    longDescription: 'تزریق ژل با متدهای ایمن و استاندارد برای حجم‌دهی لب، گونه، خط خنده و بازسازی صورت. استفاده از بهترین برندهای روز دنیا.',
    category: 'تزریقات',
    price: 'شروع از ۸۰۰,۰۰۰ تومان',
    duration: '۳۰-۴۵ دقیقه',
    sessions: 'یک جلسه',
    rating: 4.8,
    reviews: 189,
    image: '/api/placeholder/400/300',
    icon: Heart,
    features: ['ژل ایرانی', 'ژل کره‌ای', 'تزریق تخصصی', 'نتایج طبیعی'],
    popular: true,
    badge: 'محبوب‌ترین'
  },
  {
    id: 3,
    title: 'بوتاکس',
    description: 'رفع چین و چروک و جوانسازی پوست با تزریق بوتاکس اصلی',
    longDescription: 'تزریق بوتاکس برای رفع خطوط اخم، پیشانی و دور چشم. با استفاده از برندهای معتبر و متخصصان مجرب.',
    category: 'تزریقات',
    price: 'شروع از ۶۰۰,۰۰۰ تومان',
    duration: '۱۵-۳۰ دقیقه',
    sessions: 'هر ۴-۶ ماه',
    rating: 4.7,
    reviews: 156,
    image: '/api/placeholder/400/300',
    icon: Sparkles,
    features: ['بوتاکس اصلی', 'نتایج سریع', 'بدون عوارض', 'تزریق تخصصی']
  },
  {
    id: 4,
    title: 'میکرونیدلینگ',
    description: 'جوانسازی پوست، درمان جای جوش و لک با دستگاه میکرونیدلینگ',
    longDescription: 'تحریک کلاژن‌سازی طبیعی پوست با ایجاد میکروکانال‌های کنترل شده. مناسب درمان جای جوش، لک، اسکار و چین و چروک.',
    category: 'جوانسازی',
    price: 'شروع از ۴۰۰,۰۰۰ تومان',
    duration: '۴۵-۶۰ دقیقه',
    sessions: '۴-۶ جلسه',
    rating: 4.8,
    reviews: 134,
    image: '/api/placeholder/400/300',
    icon: TrendingUp,
    features: ['تحریک کلاژن', 'درمان جای جوش', 'بدون درد', 'نتایج عالی']
  },
  {
    id: 5,
    title: 'پیلینگ شیمیایی',
    description: 'لایه برداری عمیق پوست، درمان لک و روشن‌سازی پوست',
    longDescription: 'لایه برداری کنترل شده پوست با استفاده از مواد شیمیایی استاندارد. مناسب درمان لک، کدورت و ناهمواری‌های پوستی.',
    category: 'جوانسازی',
    price: 'شروع از ۳۵۰,۰۰۰ تومان',
    duration: '۳۰-۴۵ دقیقه',
    sessions: '۳-۵ جلسه',
    rating: 4.6,
    reviews: 98,
    image: '/api/placeholder/400/300',
    icon: Award,
    features: ['روشن‌سازی', 'درمان لک', 'لایه برداری', 'پوستی صاف']
  },
  {
    id: 6,
    title: 'لیزر CO2 فرکشنال',
    description: 'جوانسازی قوی پوست، درمان اسکار و چین و چروک عمیق',
    longDescription: 'قدرتمندترین روش جوانسازی پوست با لیزر CO2. مناسب درمان اسکار، چین و چروک عمیق و سفت‌سازی پوست.',
    category: 'لیزر',
    price: 'شروع از ۱,۲۰۰,۰۰۰ تومان',
    duration: '۶۰-۹۰ دقیقه',
    sessions: '۱-۳ جلسه',
    rating: 4.9,
    reviews: 87,
    image: '/api/placeholder/400/300',
    icon: Zap,
    features: ['جوانسازی قوی', 'درمان اسکار', 'سفت‌سازی', 'نتایج فوق‌العاده']
  }
]

const categories = [
  { id: 'all', name: 'همه خدمات', icon: Sparkles },
  { id: 'لیزر', name: 'لیزر', icon: Zap },
  { id: 'تزریقات', name: 'تزریقات', icon: Heart },
  { id: 'جوانسازی', name: 'جوانسازی', icon: TrendingUp }
]

export function ServicesSection({ data }: { data?: ServiceItem[] }) {
  const services = data && data.length > 0 ? data : defaultServices
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredService, setHoveredService] = useState<string | number | null>(null)

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/30">
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
            خدمات تخصصی ما
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              خدمات زیبایی و جوانسازی
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            با بهره گیری از تجهیزات پیشرفته و کادری مجرب، بهترین خدمات زیبایی را به شما ارائه می‌دهیم
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                    : 'hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            )
          })}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const Icon = service.icon || categories.find(c => c.id === service.category)?.icon || Sparkles
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 ${
                  service.popular ? 'border-rose-200 dark:border-rose-800' : 'border-transparent'
                } ${hoveredService === service.id ? 'shadow-2xl' : 'shadow-lg'}`}>
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full shadow-lg">
                        {service.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-right pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                      </div>
                      <Badge variant="secondary" className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Image */}
                    <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-xl border">
                      <Image
                        src={(service.image as string) || '/hero-1.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {(service.features || []).slice(0, 3).map((feature, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Service Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          زمان
                        </span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          جلسات
                        </span>
                        <span className="font-medium">{service.sessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          امتیاز
                        </span>
                        <span className="font-medium">{service.rating} ({service.reviews} نظر)</span>
                      </div>
                    </div>

                    {/* Price hidden per requirement */}
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-full py-3"
                      onClick={() => {
                        // Scroll to booking section
                        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      نوبت دهی
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              سوال دارید؟ مشاوره رایگان دریافت کنید!
            </h3>
            <p className="text-xl mb-8 opacity-90">
              متخصصان ما آماده پاسخگویی به سوالات شما هستند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-rose-600 hover:bg-gray-100 rounded-full px-8 py-4"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                تماس با مشاور
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-rose-600 rounded-full px-8 py-4"
              >
                مشاهده قیمت‌ها
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
