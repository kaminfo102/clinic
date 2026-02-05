"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleManager } from "@/components/admin/schedule-manager";
import { 
  Users, 
  Calendar, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Activity,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Service {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

interface Appointment {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    title: string;
    duration: number;
  };
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    pendingAppointments: 0
  });
  
  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    isActive: true
  });
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'USER',
    password: ''
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      // Fetch services
      const servicesRes = await fetch('/api/admin/services');
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      // Fetch appointments
      const appointmentsRes = await fetch('/api/admin/appointments');
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalAppointments: appointments.length,
        totalRevenue: appointments
          .filter(apt => apt.status === 'COMPLETED')
          .reduce((sum, apt) => sum + (apt.service?.duration * 10000 || 0), 0),
        pendingAppointments: appointments.filter(apt => apt.status === 'PENDING').length
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async () => {
    try {
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...serviceForm,
          duration: parseInt(serviceForm.duration),
          price: parseInt(serviceForm.price)
        })
      });

      if (response.ok) {
        await fetchData();
        setIsServiceDialogOpen(false);
        setEditingService(null);
        resetServiceForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('آیا از حذف این خدمت اطمینان دارید؟')) return;
    
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      duration: '',
      price: '',
      category: '',
      isActive: true
    });
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      isActive: service.isActive
    });
    setIsServiceDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const payload: any = { ...userForm };
      if (editingUser && !userForm.password) {
        delete payload.password;
      }
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await fetchData();
        setIsUserDialogOpen(false);
        setEditingUser(null);
        setUserForm({ name: '', email: '', phone: '', role: 'USER', password: '' });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email,
      phone: u.phone || '',
      role: u.role,
      password: ''
    });
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'secondary',
      CONFIRMED: 'default',
      CANCELLED: 'destructive',
      COMPLETED: 'success'
    } as const;
    
    const labels = {
      PENDING: 'در انتظار',
      CONFIRMED: 'تأیید شده',
      CANCELLED: 'لغو شده',
      COMPLETED: 'انجام شده'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] === 'success' ? 'default' : variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
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
            <h1 className="text-2xl font-bold">پنل مدیریت کلینیک سامارا</h1>
            <Button onClick={() => router.push('/')}>
              بازگشت به سایت
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" />
                +20% از ماه گذشته
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل نوبت‌ها</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                <Activity className="inline h-3 w-3" />
                +12% از ماه گذشته
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درآمد</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3" />
                +8% از ماه گذشته
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نوبت‌های در انتظار</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                نیاز به بررسی دارند
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">نوبت‌ها</TabsTrigger>
            <TabsTrigger value="schedule">زمان‌بندی</TabsTrigger>
            <TabsTrigger value="services">خدمات</TabsTrigger>
            <TabsTrigger value="users">کاربران</TabsTrigger>
            <TabsTrigger value="settings">تنظیمات</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>مدیریت نوبت‌ها</CardTitle>
                <CardDescription>
                  مشاهده و مدیریت نوبت‌های ثبت شده توسط کاربران
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{appointment.service.title}</h4>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 ml-1" />
                              {appointment.user.name}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 ml-1" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 ml-1" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {appointment.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CONFIRMED')}
                            >
                              <Check className="w-4 h-4 ml-1" />
                              تأیید
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CANCELLED')}
                            >
                              <X className="w-4 h-4 ml-1" />
                              لغو
                            </Button>
                          </>
                        )}
                        {appointment.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'COMPLETED')}
                          >
                            <Check className="w-4 h-4 ml-1" />
                            انجام شد
                          </Button>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          یادداشت: {appointment.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <ScheduleManager />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>مدیریت خدمات</CardTitle>
                    <CardDescription>
                      افزودن، ویرایش و حذف خدمات کلینیک
                    </CardDescription>
                  </div>
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetServiceForm}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن خدمت
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
                        </DialogTitle>
                        <DialogDescription>
                          اطلاعات خدمت را وارد کنید
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">عنوان خدمت</Label>
                          <Input
                            id="title"
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            placeholder="مثال: لیزر موهای زائد"
                          />
                        </div>
                        <div>
                          <Label>تصویر خدمت</Label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setUploadingImage(true);
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  const res = await fetch('/api/admin/services/upload', {
                                    method: 'POST',
                                    body: fd
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setServiceForm({ ...serviceForm, image: data.url } as any);
                                  }
                                } finally {
                                  setUploadingImage(false);
                                }
                              }}
                            />
                            {uploadingImage && <span className="text-sm text-muted-foreground">در حال آپلود...</span>}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">توضیحات</Label>
                          <Textarea
                            id="description"
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            placeholder="توضیحات کامل خدمت..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={serviceForm.duration}
                              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                              placeholder="60"
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">قیمت (تومان)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              placeholder="200000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">دسته‌بندی</Label>
                          <Select
                            value={serviceForm.category}
                            onValueChange={(value) => setServiceForm({ ...serviceForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="لیزر">لیزر</SelectItem>
                              <SelectItem value="تزریقات">تزریقات</SelectItem>
                              <SelectItem value="جوانسازی">جوانسازی</SelectItem>
                              <SelectItem value="پاکسازی">پاکسازی</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleSaveService} className="w-full">
                          {editingService ? 'ویرایش خدمت' : 'افزودن خدمت'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <Card key={service.id} className={service.isActive ? '' : 'opacity-50'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditService(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>دسته‌بندی:</span>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>مدت زمان:</span>
                            <span>{service.duration} دقیقه</span>
                          </div>
                          <div className="flex justify-between">
                            <span>قیمت:</span>
                            <span>{service.price.toLocaleString()} تومان</span>
                          </div>
                          <div className="flex justify-between">
                            <span>وضعیت:</span>
                            <Badge variant={service.isActive ? 'default' : 'secondary'}>
                              {service.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>مدیریت کاربران</CardTitle>
                    <CardDescription>
                      ایجاد، ویرایش و حذف کاربران
                    </CardDescription>
                  </div>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', phone: '', role: 'USER', password: '' }); }}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن کاربر
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                        </DialogTitle>
                        <DialogDescription>
                          اطلاعات کاربر را وارد کنید
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>نام</Label>
                          <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label>ایمیل</Label>
                          <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                        </div>
                        <div>
                          <Label>تلفن</Label>
                          <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                        </div>
                        <div>
                          <Label>نقش</Label>
                          <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="نقش را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">کاربر</SelectItem>
                              <SelectItem value="ADMIN">مدیر</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>رمز عبور</Label>
                          <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUser ? 'در صورت نیاز تغییر دهید' : ''} />
                        </div>
                        <Button onClick={handleSaveUser} className="w-full">
                          {editingUser ? 'ویرایش کاربر' : 'افزودن کاربر'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{user.name || 'بدون نام'}</h4>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 ml-1" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 ml-1" />
                                {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role === 'ADMIN' ? 'مدیر' : 'کاربر عادی'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline" onClick={() => openEditUser(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات کلینیک</CardTitle>
                <CardDescription>
                  مدیریت اطلاعات و تنظیمات کلینیک
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">اطلاعات تماس</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clinic-phone">تلفن کلینیک</Label>
                        <Input id="clinic-phone" placeholder="۰۲۱-۸۸۰۰۰۰۰۰" />
                      </div>
                      <div>
                        <Label htmlFor="clinic-address">آدرس کلینیک</Label>
                        <Input id="clinic-address" placeholder="تهران، خیابان ولیعصر" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">ساعات کاری</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="saturday-hours">شنبه تا چهارشنبه</Label>
                          <Input id="saturday-hours" placeholder="۹:۰۰ - ۲۰:۰۰" />
                        </div>
                        <div>
                          <Label htmlFor="friday-hours">پنج‌شنبه</Label>
                          <Input id="friday-hours" placeholder="۹:۰۰ - ۱۸:۰۰" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">ذخیره تنظیمات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
