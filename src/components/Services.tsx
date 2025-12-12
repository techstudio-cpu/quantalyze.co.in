"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { FaBullhorn, FaCode, FaRobot, FaChevronDown } from "react-icons/fa";

type Service = {
  id: string;
  name: string;
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  points: string[];
  price?: string;
};

const STATIC_SERVICES: Service[] = [
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    tagline: "Grow your online presence with data‑driven campaigns",
    icon: FaBullhorn,
    href: "/services/paid-advertising",
    points: [
      "Search & social ad campaigns",
      "SEO & content strategy",
      "Analytics & conversion tracking",
      "Performance reporting",
    ],
    price: "25000",
  },
  {
    id: "web-development",
    name: "Website Development",
    tagline: "Fast, modern and mobile‑first business websites",
    icon: FaCode,
    href: "/services/website-development",
    points: [
      "Custom landing pages",
      "E‑commerce & booking flows",
      "Speed & Core Web Vitals optimisation",
      "Ongoing maintenance",
    ],
    price: "35000",
  },
  {
    id: "ai-automation",
    name: "AI Automation",
    tagline: "Automate workflows and customer journeys with AI",
    icon: FaRobot,
    href: "/services/ai-automation",
    points: [
      "Chatbots & lead qualification",
      "CRM & marketing automation",
      "Reporting dashboards",
      "Custom AI workflows",
    ],
    price: "29999",
  },
];

function mapApiIcon(icon?: string | null, category?: string | null): ComponentType<{ className?: string }> {
  const key = (icon || category || "").toLowerCase();

  if (key.includes("dev") || key.includes("web") || key.includes("code")) {
    return FaCode;
  }

  if (key.includes("ai") || key.includes("auto") || key.includes("bot")) {
    return FaRobot;
  }

  return FaBullhorn;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!data?.success || !Array.isArray(data.services) || data.services.length === 0) {
          return;
        }

        if (cancelled) return;

        const mapped: Service[] = data.services.map((s: any, index: number) => ({
          id: String(s.id ?? index),
          name: s.title ?? s.name ?? "Service",
          tagline: s.description ?? "Comprehensive digital solution",
          icon: mapApiIcon(s.icon, s.category),
          href: s.slug ? `/services/${s.slug}` : "/services",
          points: [s.description].filter(Boolean),
          price: s.price ? String(s.price) : undefined,
        }));

        setServices(mapped);
      } catch (error) {
        console.error("Failed to load services", error);
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            Our Services / Solutions
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            We Deliver Service According To Your Needs
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Comprehensive digital solutions to help your brand succeed online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = activeIndex === index;

            return (
              <div
                key={service.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-yellow-400/10 bg-white/80 p-[1px] shadow-[0_24px_46px_-32px_rgba(17,24,39,0.55)] transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400/40 hover:shadow-[0_38px_70px_-30px_rgba(17,24,39,0.55)]"
              >
                <div className="relative z-10 flex h-full flex-col rounded-[24px] border border-white/60 bg-white/95 p-7 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className="flex w-full items-start gap-4 text-left focus:outline-none"
                    aria-expanded={isActive}
                  >
                    <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-500 text-white shadow-[0_16px_30px_-18px_rgba(234,179,8,0.75)]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {service.name}
                        </h4>
                        <FaChevronDown
                          className={`mt-1 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                            isActive ? "rotate-180 text-yellow-600" : "text-gray-400"
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.tagline}
                      </p>
                      {service.price && (
                        <p className="text-sm font-semibold text-green-600">
                          Starting at ₹{service.price}
                        </p>
                      )}
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isActive ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3 text-sm text-gray-700">
                        {service.points.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={service.href}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 hover:text-yellow-800"
                      >
                        Explore Service
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Ready to elevate your digital presence?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Let&apos;s Work Together
          </Link>
        </div>
      </div>
    </section>
  );
}
