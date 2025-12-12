"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import dynamic from "next/dynamic";

type Service = {
  id: string;
  name: string;
  tagline: string;
  icon?: string;
  href: string;
  subServices: string[];
  price?: string;
};

const iconMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "📢": () => import("react-icons/fa").then((m) => ({ default: m.FaBullhorn })),
  "📈": () => import("react-icons/fa").then((m) => ({ default: m.FaChartLine })),
  "💻": () => import("react-icons/fa").then((m) => ({ default: m.FaCode })),
  "🎨": () => import("react-icons/fa").then((m) => ({ default: m.FaPalette })),
  "🤖": () => import("react-icons/fa").then((m) => ({ default: m.FaRobot })),
  "🌍": () => import("react-icons/fa").then((m) => ({ default: m.FaGlobe })),
};

const fallbackIcon = dynamic(() => import("react-icons/fa").then((m) => m.FaBullhorn), {
  ssr: false,
});

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const res = await fetch("/api/admin/services", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setServices(data.data as Service[]);
        }
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const servicesWithIcons = useMemo(() => {
    return services.map((service) => {
      const IconComponent = service.icon && iconMap[service.icon]
        ? dynamic(iconMap[service.icon], { ssr: false })
        : fallbackIcon;
      return { ...service, IconComponent };
    });
  }, [services]);

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
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

        {/* Services Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading services...</div>
        ) : servicesWithIcons.length === 0 ? (
          <div className="text-center text-gray-500">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesWithIcons.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={service.id ?? service.name}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-yellow-400/10 bg-white/80 p-[1px] shadow-[0_24px_46px_-32px_rgba(17,24,39,0.55)] transition-all duration-500 hover:-translate-y-3 hover:-rotate-[0.65deg] hover:border-yellow-400/40 hover:shadow-[0_38px_70px_-30px_rgba(17,24,39,0.55)]"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-300/15 to-yellow-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -inset-[55%] bg-gradient-to-br from-yellow-400/0 via-yellow-400/12 to-yellow-500/25 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <div className="relative z-10 flex h-full flex-col rounded-[24px] border border-white/60 bg-white/95 p-7 backdrop-blur-xl transition-all duration-500 group-hover:border-yellow-200/60 group-hover:bg-white">
                    <button
                      type="button"
                      onClick={() => handleToggle(index)}
                      className="flex w-full items-start gap-4 text-left focus:outline-none"
                      aria-expanded={isActive}
                    >
                      <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-500 text-white shadow-[0_16px_30px_-18px_rgba(234,179,8,0.75)] transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_24px_38px_-20px_rgba(234,179,8,0.6)]">
                        <service.IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xl font-semibold text-gray-900 transition-colors duration-500 group-hover:text-yellow-600">
                            {service.name}
                          </h4>
                          <FaChevronDown
                            className={`mt-1 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                              isActive ? "rotate-180 text-yellow-600" : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-500 group-hover:text-gray-700">
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
                        isActive
                          ? "mt-6 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-3 text-sm text-gray-700">
                          {service.subServices.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={service.href}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 transition-colors hover:text-yellow-800"
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
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Ready to elevate your digital presence?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Let&apos;s Work Together
          </a>
        </div>
      </div>
    </section>
  );
}
