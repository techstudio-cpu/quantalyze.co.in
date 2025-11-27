"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaLightbulb, FaCode, FaRocket, FaChartBar } from "react-icons/fa";

const steps = [
  {
    number: "01",
    title: "Discovery & Research",
    icon: FaSearch,
    description: "We dive deep into understanding your business, target audience, competitors, and goals to create a solid foundation.",
  },
  {
    number: "02",
    title: "Strategy & Planning",
    icon: FaLightbulb,
    description: "Based on insights, we craft a comprehensive strategy with clear milestones, timelines, and deliverables.",
  },
  {
    number: "03",
    title: "Design & Development",
    icon: FaCode,
    description: "Our creative and technical teams bring the strategy to life with stunning designs and robust code.",
  },
  {
    number: "04",
    title: "Launch & Implementation",
    icon: FaRocket,
    description: "We execute the plan flawlessly, ensuring a smooth launch with minimal disruption to your operations.",
  },
  {
    number: "05",
    title: "Monitor & Optimize",
    icon: FaChartBar,
    description: "Continuous monitoring, testing, and optimization ensure sustained growth and improved performance.",
  },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="process" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-white" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-yellow-200/30 blur-3xl" style={{ animation: "process-orbit 28s linear infinite" }} />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[360px] w-[360px] translate-y-1/3 rounded-full bg-yellow-400/25 blur-2xl" style={{ animation: "process-orbit 32s linear infinite reverse" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Narrative column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100/80 px-5 py-2 text-sm font-semibold text-yellow-700 shadow ring-1 ring-yellow-200/60 backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              How Quantalyze ships momentum fast
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              One seamless pod executing <span className="hero-text-gradient">end-to-end growth</span>
            </h2>

            <p className="text-lg text-gray-600">
              Every engagement moves through a repeatable flywheel. Automation brings speed, human insight keeps it sharp, and measurement makes the next sprint smarter.
            </p>

            <div className="rounded-3xl border border-yellow-200/60 bg-white/80 p-6 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-500">Five-stage flywheel</p>
              <div className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    onMouseEnter={() => setActiveStep(index)}
                    onFocus={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                      activeStep === index
                        ? "border-yellow-400/80 bg-yellow-100/70 shadow-md"
                        : "border-yellow-200/40 bg-white/60 hover:border-yellow-300/70 hover:bg-white"
                    }`}
                  >
                    <span className="text-sm font-bold text-yellow-600">{step.number}</span>
                    <span className="text-sm font-semibold text-gray-700">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline column */}
          <div className="relative">
            <div className="absolute inset-4 rounded-[42px] bg-gradient-to-br from-yellow-200/40 via-yellow-300/30 to-yellow-500/20 blur-3xl" style={{ animation: "gradient-pan 18s ease-in-out infinite" }} />

            <div className="relative overflow-hidden rounded-[40px] border border-yellow-200/60 bg-white/80 p-10 shadow-[0_48px_100px_-48px_rgba(250,204,21,0.65)] backdrop-blur-xl">
              <div className="relative grid gap-8">
                <div className="absolute left-[22px] top-0 h-full w-[2px] bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200" aria-hidden />

                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  return (
                    <div key={step.title} className="relative">
                      <div className={`absolute -left-[11px] top-3 h-5 w-5 rounded-full border-2 ${
                        isActive ? "border-yellow-500 bg-yellow-400" : "border-yellow-300 bg-white"
                      } shadow`} />

                      <div
                        className={`group relative ml-12 flex flex-col gap-3 rounded-3xl border px-6 py-5 transition-all duration-500 ${
                          isActive
                            ? "border-yellow-400/80 bg-gradient-to-br from-yellow-100/80 via-white to-yellow-50 shadow-2xl"
                            : "border-yellow-200/50 bg-white/70 hover:border-yellow-300/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-500 text-black shadow-lg">
                            <step.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-500">{step.number}</p>
                            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-yellow-100/80 px-8 py-6 text-center text-gray-800 shadow-lg ring-1 ring-yellow-200/70">
          <p className="text-lg font-semibold">Every project gets a custom roadmap, weekly rituals, and an embedded squad until wins compound.</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes process-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
