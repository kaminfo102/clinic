"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  LogOut,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";

interface Appointment {
  id: string;
  service: {
    title: string;
    duration: number;
    price: number;
  };
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0
  });
  
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    
    fetchAppointments();
  }, [user, router]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
        
        // Calculate stats
        const total = data.appointments?.length || 0;
        const pending = data.appointments?.filter((apt: Appointment) => apt.status === 'PENDING').length || 0;
        const confirmed = data.appointments?.filter((apt: Appointment) => apt.status === 'CONFIRMED').length || 0;
        const completed = data.appointments?.filter((apt: Appointment) => apt.status === 'COMPLETED').length || 0;
        
        setStats({
          totalAppointments: total,
          pendingAppointments: pending,
          confirmedAppointments: confirmed,
          completedAppointments: completed
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'secondary',
      CONFIRMED: 'default',
      CANCELLED: 'destructive',
      COMPLETED: 'success'
    } as const;
    
    const labels = {
      PENDING: 'در انتظار تایید',
      CONFIRMED: 'تأیید شده',
      CANCELLED: 'لغو شده',
      COMPLETED: 'انجام شده'
    };
    
    const icons = {
      PENDING: <AlertCircle className="w-3 h-3 ml-1" />,
      CONFIRMED: <CheckCircle className="w-3 h-3 ml-1" />,
      CANCELLED: <XCircle className="w-3 h-3 ml-1" />,
      COMPLETED: <CheckCircle className="w-3 h-3 ml-1" />
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center">
        {labels[status as keyof typeof labels]}
        {icons[status as keyof typeof icons]}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'text-yellow-600',
      CONFIRMED: 'text-blue-600',
      CANCELLED: 'text-red-600',
      COMPLETED: 'text-green-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('آیا از لغو این نوبت اطمینان دارید؟')) return;
    
    try {
      // This would need to be implemented on the backend
      // For now, just show a message
      alert('این قابلیت در حال توسعه است');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">س</span>
                </div>
                <h1 className="text-xl font-bold">پنل کاربری</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 ml-2" />
                    تنظیمات
                  </Link>
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">
              خوش آمدید، {user?.name}! 👋
            </h2>
            <p className="text-muted-foreground">
              به پنل کاربری کلینیک زیبایی سامارا خوش آمدید. در اینجا می‌توانید نوبت‌های خود را مدیریت کنید.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل نوبت‌ها</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" />
                نوبت‌های ثبت شده
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در انتظار تایید</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                نیاز به بررسی ادمین
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تأیید شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.confirmedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                نوبت‌های تأیید شده
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">انجام شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                نوبت‌های انجام شده
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>نوبت‌های من</CardTitle>
                  <CardDescription>
                    مشاهده و مدیریت نوبت‌های ثبت شده
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/#booking">
                    <Calendar className="w-4 h-4 ml-2" />
                    نوبت جدید
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">هنوز نوبتی ثبت نکرده‌اید</h3>
                  <p className="text-muted-foreground mb-6">
                    برای ثبت اولین نوبت خود، روی دکمه زیر کلیک کنید
                  </p>
                  <Button asChild>
                    <Link href="/#booking">
                      <Calendar className="w-4 h-4 ml-2" />
                      ثبت نوبت جدید
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{appointment.service.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 ml-1" />
                              {formatDate(appointment.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 ml-1" />
                              {appointment.time}
                            </span>
                            <span className="flex items-center">
                              <Activity className="w-4 h-4 ml-1" />
                              {appointment.service.duration} دقیقه
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          هزینه: {appointment.service.price.toLocaleString()} تومان
                        </div>
                        
                        <div className="flex gap-2">
                          {appointment.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <XCircle className="w-4 h-4 ml-1" />
                              لغو نوبت
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">یادداشت:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
              <CardDescription>
                دسترسی سریع به خدمات پرکاربرد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-16 flex-col gap-2">
                  <Link href="/#booking">
                    <Calendar className="w-6 h-6" />
                    <span>نوبت جدید</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col gap-2">
                  <Link href="#services">
                    <Star className="w-6 h-6" />
                    <span>خدمات</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col gap-2">
                  <Link href="#contact">
                    <Phone className="w-6 h-6" />
                    <span>تماس با ما</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}