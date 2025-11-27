"use client";

import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState } from "react";

const highlights = [
  {
    value: "69x",
    label: "Faster campaign throughput",
    copy: "Automation playbooks launch new funnels in hours, not weeks.",
  },
  {
    value: "4.8x",
    label: "Average ROAS across paid channels",
    copy: "Full-funnel optimisation ties performance ads with retention.",
  },
  {
    value: "+320%",
    label: "Organic visibility lift",
    copy: "Compound SEO engines blend founders' POV with topical clusters.",
  },
];

const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const isPercentage = suffix === '%';
  const targetValue = isPercentage ? parseInt(target) : parseInt(target);
  const duration = 2000; // 2 seconds
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);
  const easeOutQuad = (t: number) => t * (2 - t);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = Math.round(targetValue * progress);
      
      if (frame === totalFrames) {
        setCount(targetValue);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [targetValue, totalFrames]);

  return <span>{count}{suffix}</span>;
};

export default function Hero() {
  const [activeHighlight, setActiveHighlight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % highlights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-white to-yellow-50/10" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" style={{ animation: "hero-orbit 18s linear infinite" }} />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-yellow-500/30 blur-3xl" style={{ animation: "hero-orbit 22s linear infinite reverse" }} />

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left Column */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-yellow-700 shadow-lg ring-1 ring-yellow-100/60 backdrop-blur animate-fade-in">
              <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              Quantalyze, your unfair growth advantage
            </div>

            <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
              Build magnetic <span className="hero-text-gradient">digital experiences</span>
              <br className="hidden sm:block" /> powered by <span className="hero-text-gradient">AI strategy</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600">
              From automation copilots to demand engines, we stitch systems that feel premium, convert harder, and scale with your momentum.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ScrollLink
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-8 py-3 text-base font-semibold text-black shadow-xl ring-2 ring-yellow-400/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:ring-yellow-500 min-h-[44px]"
              >
                Book a strategy call
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </ScrollLink>
              <ScrollLink
                to="services"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/60 px-8 py-3 text-base font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-500 hover:bg-yellow-100 min-h-[44px]"
              >
                Explore our playbooks
              </ScrollLink>
            </div>

            {/* Stats Row */}
            <div className="mt-14 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[{ number: "150+", label: "Brands partnered" }, { number: "90%", label: "Retention rate" }, { number: "102+", label: "Launches delivered" }].map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl border border-yellow-200/60 bg-white/70 p-5 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-yellow-400/80 hover:shadow-2xl"
                  style={{ animation: "hero-float 16s ease-in-out infinite", animationDelay: `${index * 2}s` }}
                >
                  <div className="text-3xl font-bold text-yellow-600">
                    {stat.number.endsWith("%") ? (
                      <AnimatedCounter target={stat.number.replace("%", "")} suffix="%" />
                    ) : stat.number.endsWith("+") ? (
                      <AnimatedCounter target={stat.number.replace("+", "")} suffix="+" />
                    ) : (
                      stat.number
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-300/0 via-yellow-300/10 to-yellow-400/20 opacity-0 transition-opacity duration-500 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="absolute inset-x-10 -top-10 -bottom-16 rounded-[48px] bg-gradient-to-br from-yellow-200/40 via-yellow-300/30 to-yellow-500/20 blur-2xl" style={{ animation: "gradient-pan 18s ease-in-out infinite" }} />

            <div className="relative space-y-4 rounded-[38px] border border-yellow-200/50 bg-white/80 p-6 shadow-[0_48px_100px_-48px_rgba(250,204,21,0.65)] backdrop-blur-xl">
              <div className="flex items-center gap-3 rounded-full border border-yellow-200/60 bg-white/70 px-5 py-2 text-sm font-semibold text-yellow-700 shadow-inner">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Real wins from our growth labs
              </div>

              <div className="space-y-3">
                {highlights.map((item, index) => {
                  const isActive = activeHighlight === index;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onMouseEnter={() => setActiveHighlight(index)}
                      onFocus={() => setActiveHighlight(index)}
                      className={`group relative w-full overflow-hidden rounded-3xl border px-6 py-6 text-left transition-all duration-500 ${
                        isActive
                          ? "border-yellow-400/80 bg-gradient-to-br from-yellow-100/60 via-white to-yellow-50 shadow-xl"
                          : "border-yellow-200/40 bg-white/60 hover:border-yellow-300/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl font-bold tracking-tight transition-all duration-500 ${isActive ? "text-yellow-600" : "text-gray-400"}`}>
                          {item.value}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold uppercase tracking-wide ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                            {item.label}
                          </p>
                          <p className={`mt-1 text-sm leading-relaxed transition-colors duration-500 ${isActive ? "text-gray-700" : "text-gray-500"}`}>
                            {item.copy}
                          </p>
                        </div>
                      </div>
                      <span className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-300/0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-yellow-200/60 bg-white/80 px-6 py-5 text-sm text-gray-600 shadow-inner">
                <p className="font-semibold text-yellow-700">Inside the pod</p>
                <p className="mt-1 text-sm leading-relaxed">
                  Strategy sprints, AI build squads, and creative ops all synced to a single growth map. Every engagement unlocks your own Quantalyze war room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hero-text-gradient {
          background: linear-gradient(120deg, #facc15 0%, #fb923c 50%, #fcd34d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes hero-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes hero-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient-pan {
          0% {
            transform: translate3d(-5%, -5%, 0) scale(1);
          }
          50% {
            transform: translate3d(5%, 5%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-5%, -5%, 0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
