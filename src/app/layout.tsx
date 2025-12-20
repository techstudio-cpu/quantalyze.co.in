import "./globals.css";
import type { Metadata, Viewport } from "next";
 import { headers } from "next/headers";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f59e0b",
};

const baseMetadata: Metadata = {
  title: "Quantalyze - Digital Marketing Agency | AI-Powered Growth Solutions",
  description: "Transform your digital presence with Quantalyze's AI-powered marketing solutions. From automation to demand engines, we build magnetic digital experiences that convert and scale.",
  keywords: "digital marketing, AI strategy, automation, SEO, social media, demand generation, growth marketing",
  authors: [{ name: "Quantalyze" }],
  openGraph: {
    title: "Quantalyze - AI-Powered Digital Marketing",
    description: "Build magnetic digital experiences powered by AI strategy",
    type: "website",
    locale: "en_US",
    url: "https://quantalyze.up.railway.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantalyze - AI-Powered Digital Marketing",
    description: "Transform your digital presence with our AI-powered marketing solutions",
  },
  robots: "index, follow",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    const envBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const baseUrl = host ? `${proto}://${host}` : envBaseUrl;
    const response = await fetch(`${baseUrl}/api/seo-meta?route=${encodeURIComponent("/")}`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    const meta = data?.meta;

    if (!data?.success || !meta) return baseMetadata;

    return {
      ...baseMetadata,
      title: meta.title || baseMetadata.title,
      description: meta.description || baseMetadata.description,
      keywords: meta.keywords || baseMetadata.keywords,
      openGraph: {
        ...(baseMetadata.openGraph || {}),
        title: meta.og_title || (baseMetadata.openGraph as any)?.title,
        description: meta.og_description || (baseMetadata.openGraph as any)?.description,
      },
    };
  } catch {
    return baseMetadata;
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/quantalyze.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen font-sans bg-yellow-50 text-gray-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}
