'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Heart, 
  Star,
  ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    title: 'جوانسازی پوست با تکنولوژی روز دنیا',
    subtitle: 'با دستگاه‌های پیشرفته و متخصصان مجرب',
    description: 'خدمات جوانسازی پوست با جدیدترین متدهای روز دنیا',
    image: '/hero-1.jpg',
    badge: 'تخفیف ویژه',
    badgeColor: 'bg-rose-500',
    cta: 'مشاهده خدمات',
    ctaLink: '#services',
    features: ['لیزر CO2', 'میکرونیدلینگ', 'پیلینگ']
  },
  {
    id: 2,
    title: 'تزریق ژل و بوتاکس تخصصی',
    subtitle: 'با بهترین برندهای جهانی',
    description: 'تزریق ژل و بوتاکس با متدهای ایمن و استاندارد',
    image: '/hero-1.jpg',
    badge: 'محبوب‌ترین',
    badgeColor: 'bg-purple-500',
    cta: 'نوبت دهی',
    ctaLink: '#booking',
    features: ['ژل ایرانی', 'ژل کره‌ای', 'بوتاکس']
  },
  {
    id: 3,
    title: 'لیزر موهای زائد با دستگاه الیت',
    subtitle: '永久 حذف موهای زائد',
    description: 'دستگاه الیت + جدیدترین و پیشرفته‌ترین دستگاه لیزر جهان',
    image: '/hero-1.jpg',
    badge: 'ضمانت کیفیت',
    badgeColor: 'bg-green-500',
    cta: 'مشاوره رایگان',
    ctaLink: '#contact',
    features: ['الیت +', 'آلکساندرایت', 'دیود']
  }
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-pink-900/70 to-purple-900/80" />
            </div>
            
            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6 text-right"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Badge 
                      className={`${slides[currentSlide].badgeColor} text-white px-4 py-2 text-sm font-medium`}
                    >
                      {slides[currentSlide].badge}
                    </Badge>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {slides[currentSlide].title}
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-xl text-muted-foreground font-medium"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-lg text-muted-foreground leading-relaxed"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex flex-wrap gap-2"
                  >
                    {slides[currentSlide].features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <a href={slides[currentSlide].ctaLink}>
                        {slides[currentSlide].cta}
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg font-medium rounded-full border-2 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Play className="w-5 h-5 ml-2" />
                      ویدیو معرفی
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative">
                    {/* Main Visual */}
                    <div className="w-full h-[400px] bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-32 h-32 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl"
                      >
                        <Sparkles className="w-16 h-16 text-white" />
                      </motion.div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 -right-4 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Heart className="w-10 h-10 text-purple-500" />
                    </motion.div>

                    <motion.div
                      animate={{ 
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                      className="absolute -bottom-4 -left-4 w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Star className="w-10 h-10 text-rose-500" />
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="absolute top-8 left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 shadow-lg"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">۵۰+</div>
                        <div className="text-sm text-muted-foreground">خدمات تخصصی</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="absolute bottom-8 right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 shadow-lg"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">۱۰۰۰+</div>
                        <div className="text-sm text-muted-foreground">مشتری راضی</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-white dark:hover:bg-gray-800 rounded-full w-12 h-12"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-white dark:hover:bg-gray-800 rounded-full w-12 h-12"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-rose-500 w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}