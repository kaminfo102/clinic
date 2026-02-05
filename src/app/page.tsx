import { HeroSlider } from "@/components/shared/hero-slider";
import { ServicesSection, ServiceItem } from "@/components/shared/services-section";
import { BookingSection } from "@/components/shared/booking-section";
import { ContactSection } from "@/components/shared/contact-section";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbServices = await db.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const services: ServiceItem[] = dbServices.map(service => ({
    id: service.id,
    title: service.title,
    description: service.description || '',
    category: service.category,
    price: service.price ? `${service.price.toLocaleString('fa-IR')} تومان` : 'تماس بگیرید',
    duration: `${service.duration} دقیقه`,
    image: service.image,
    // Default values for UI-only fields
    features: [], 
    rating: 5.0,
    reviews: 0,
    sessions: '۱ جلسه',
    popular: false,
    badge: ''
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20">
          <HeroSlider />
        </section>

        {/* Services Section */}
        <ServicesSection data={services} />

        {/* Booking Section */}
        <BookingSection data={services} />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
