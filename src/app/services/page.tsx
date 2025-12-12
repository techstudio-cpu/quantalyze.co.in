import { Metadata } from "next";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
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

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <Services />
      <WhyUs />
      <Contact />
    </div>
  );
}
