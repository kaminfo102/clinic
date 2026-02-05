'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from 'next-themes'
import { 
  Menu, 
  X, 
  Calendar, 
  Phone, 
  MapPin, 
  Sun, 
  Moon,
  User,
  Settings,
  LogOut,
  Heart,
  Sparkles,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'صفحه اصلی', href: '/', icon: Heart },
  { name: 'خدمات', href: '#services', icon: Sparkles },
  { name: 'نوبت دهی', href: '#booking', icon: Calendar },
  { name: 'تماس با ما', href: '#contact', icon: Phone },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>۰۲۱-۸۸۰۰۰۰۰۰</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>تهران، بلوار آفریقا</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              <Star className="w-3 h-3 ml-1" />
              ۴.۹/۵
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: scrolled ? -10 : 0 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  کلینیک زیبایی سامارا
                </h1>
                <p className="text-xs text-muted-foreground">تخصصی خدمات زیبایی و جوانسازی</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-rose-600 group ${
                      pathname === item.href ? 'text-rose-600' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex"
              >
                <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                          {user.name?.charAt(0) || 'کاربر'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>پنل کاربری</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>تنظیمات</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span>پنل ادمین</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>خروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">ورود</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                    <Link href="/register">ثبت نام</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-6 mt-6">
                    <Link href="/" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">کلینیک زیبایی سامارا</span>
                    </Link>
                    
                    <div className="flex flex-col gap-4">
                      {navigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-rose-600 ${
                              pathname === item.href ? 'text-rose-600' : 'text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>

                    <div className="border-t pt-4">
                      {user ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                                {user.name?.charAt(0) || 'کاربر'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Button asChild className="w-full">
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                              پنل کاربری
                            </Link>
                          </Button>
                          <Button variant="outline" onClick={handleLogout} className="w-full">
                            خروج
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                              ورود
                            </Link>
                          </Button>
                          <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-600">
                            <Link href="/register" onClick={() => setIsOpen(false)}>
                              ثبت نام
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}