'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Youtube,
  Heart,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

const footerLinks = {
  services: [
    { name: 'لیزر موهای زائد', href: '#' },
    { name: 'تزریق ژل و فیلر', href: '#' },
    { name: 'بوتاکس', href: '#' },
    { name: 'جوانسازی پوست', href: '#' },
    { name: 'میکرونیدلینگ', href: '#' },
    { name: 'پیلینگ شیمیایی', href: '#' },
  ],
  quickLinks: [
    { name: 'درباره ما', href: '/about' },
    { name: 'خدمات', href: '#services' },
    { name: 'نوبت دهی آنلاین', href: '#booking' },
    { name: 'گالری تصاویر', href: '/gallery' },
    { name: 'مقالات', href: '/blog' },
    { name: 'تماس با ما', href: '#contact' },
  ],
  legal: [
    { name: 'شرایط استفاده', href: '/terms' },
    { name: 'حریم خصوصی', href: '/privacy' },
    { name: 'سوالات متداول', href: '/faq' },
  ]
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  کلینیک زیبایی سامارا
                </h3>
                <p className="text-sm text-muted-foreground">تخصصی خدمات زیبایی و جوانسازی</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              با بهره گیری از تجهیزات پیشرفته و کادری مجرب، آماده ارائه بهترین خدمات زیبایی به شما عزیزان هستیم.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>تهران، بلوار آفریقا، خیابان نلسون ماندلا</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-rose-500" />
                <span>۰۲۱-۸۸۰۰۰۰۰۰</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-rose-500" />
                <span>info@samaraclinic.ir</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>شنبه تا چهارشنبه: ۹ الی ۲۰</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">خدمات ما</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-rose-600 transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">دسترسی سریع</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-rose-600 transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">خبرنامه</h4>
            <p className="text-sm text-muted-foreground">
              برای دریافت آخرین تخفیف‌ها و خدمات جدید، عضو خبرنامه ما شوید.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="text-right"
              />
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                عضویت
              </Button>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-semibold">پیوستن به ما</h5>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} کلینیک زیبایی سامارا. تمام حقوق محفوظ است.</span>
            <div className="flex items-center gap-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-rose-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            <span>ساخت با</span>
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>توسط تیم سامارا</span>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}