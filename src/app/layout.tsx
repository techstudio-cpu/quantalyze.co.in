import "./globals.css";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Quantalyze - Digital Marketing Agency | AI-Powered Growth Solutions",
  description: "Transform your digital presence with Quantalyze's AI-powered marketing solutions. From automation to demand engines, we build magnetic digital experiences that convert and scale.",
  keywords: "digital marketing, AI strategy, automation, SEO, social media, demand generation, growth marketing",
  authors: [{ name: "Quantalyze" }],
  openGraph: {
    title: "Quantalyze - AI-Powered Digital Marketing",
    description: "Build magnetic digital experiences powered by AI strategy",
    type: "website",
    locale: "en_US",
    url: "https://quantalyze.co.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantalyze - AI-Powered Digital Marketing",
    description: "Transform your digital presence with our AI-powered marketing solutions",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/quantalyze.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body className="min-h-screen font-sans bg-yellow-50 text-gray-900" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
        <TopBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
