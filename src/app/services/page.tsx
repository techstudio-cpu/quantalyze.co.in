import { Metadata } from "next";
import { headers } from "next/headers";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";

const baseMetadata: Metadata = {
  title: "Services - Quantalyze | Digital Marketing Solutions",
  description: "Explore our comprehensive digital marketing services including SEO, social media marketing, content writing, web development, and more. Transform your digital presence with Quantalyze.",
  keywords: "digital marketing services, SEO, social media, web development, content writing, paid advertising, email marketing",
  openGraph: {
    title: "Services - Quantalyze Digital Marketing",
    description: "Comprehensive digital solutions to help your brand succeed online",
    type: "website",
    locale: "en_US",
    url: "https://quantalyze.up.railway.app/services",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    const envBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const baseUrl = host ? `${proto}://${host}` : envBaseUrl;
    const route = "/services";
    const response = await fetch(`${baseUrl}/api/seo-meta?route=${encodeURIComponent(route)}`, {
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

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <Services />
      <WhyUs />
      <Contact />
    </div>
  );
}
