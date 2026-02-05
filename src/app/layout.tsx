import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "کلینیک زیبایی سامارا - سیستم نوبت دهی آنلاین",
  description: "سیستم نوبت دهی آنلاین کلینیک زیبایی سامارا. خدمات لیزر، تزریق ژل، بوتاکس و جوانسازی پوست با بهترین کیفیت.",
  keywords: ["کلینیک زیبایی", "لیزر", "تزریق ژل", "بوتاکس", "جوانسازی پوست", "نوبت دهی آنلاین"],
  authors: [{ name: "کلینیک زیبایی سامارا" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "کلینیک زیبایی سامارا - سیستم نوبت دهی آنلاین",
    description: "خدمات زیبایی و جوانسازی پوست با نوبت دهی آنلاین",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "کلینیک زیبایی سامارا",
    description: "خدمات زیبایی و جوانسازی پوست با نوبت دهی آنلاین",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
