"use client";

import { FaAward, FaUsers, FaChartLine, FaLightbulb, FaClock, FaShieldAlt } from "react-icons/fa";

const reasons = [
  {
    icon: FaAward,
    title: "Proven Expertise",
    description: "Over 500+ successful projects delivered with award-winning results across diverse industries.",
  },
  {
    icon: FaUsers,
    title: "Dedicated Team",
    description: "A passionate team of 50+ specialists committed to your success, available 24/7 for support.",
  },
  {
    icon: FaChartLine,
    title: "Data-Driven Results",
    description: "We use advanced analytics and proven strategies to deliver measurable ROI and growth.",
  },
  {
    icon: FaLightbulb,
    title: "Innovative Solutions",
    description: "Stay ahead of the curve with cutting-edge technologies and creative marketing approaches.",
  },
  {
    icon: FaClock,
    title: "On-Time Delivery",
    description: "We respect your deadlines and consistently deliver projects on time, every time.",
  },
  {
    icon: FaShieldAlt,
    title: "Transparent Process",
    description: "Complete transparency in pricing, timelines, and reporting. No hidden costs or surprises.",
  },
];

const proofPoints = [
  "Cross-functional pods blend strategy, creative, and automation for every sprint.",
  "Real-time dashboards so you see movement before the monthly report drops.",
  "Founders stay looped into positioning and GTM story arcs as we launch.",
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-100" />
      <div className="pointer-events-none absolute -top-32 right-10 h-72 w-72 rounded-full bg-yellow-300/25 blur-3xl" style={{ animation: "whyus-orbit 20s linear infinite" }} />
      <div className="pointer-events-none absolute -bottom-36 left-6 h-80 w-80 rounded-full bg-yellow-500/20 blur-2xl" style={{ animation: "whyus-orbit 26s linear infinite reverse" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Narrative Column */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-yellow-700 shadow-lg ring-1 ring-yellow-200/50 backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Why partners stay with Quantalyze
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Growth pods engineered <span className="hero-text-gradient">for momentum</span>
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              We stitch specialists into one accountable squad: strategists, creatives, automation engineers, analysts. Everyone moves in lockstep to ship category-leading work.
            </p>

            <div className="mt-10 space-y-5 border-l-2 border-dashed border-yellow-400/60 pl-6">
              {proofPoints.map((point, index) => (
                <div key={point} className="relative">
                  <span className="absolute -left-8 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-yellow-600 shadow ring-2 ring-yellow-400/80">{index + 1}</span>
                  <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">Signal {index + 1}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cards Column */}
          <div className="relative">
            <div className="absolute inset-4 rounded-[42px] bg-gradient-to-br from-yellow-200/40 via-yellow-300/30 to-yellow-500/20 blur-3xl" style={{ animation: "gradient-pan 18s ease-in-out infinite" }} />

            <div className="relative grid gap-6 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <div
                  key={reason.title}
                  className="group relative overflow-hidden rounded-3xl border border-yellow-200/60 bg-white/70 p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/80 hover:shadow-2xl"
                  style={{ animation: "card-float 14s ease-in-out infinite", animationDelay: `${index * 1.5}s` }}
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-300/0 via-yellow-200/20 to-yellow-400/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-200 via-yellow-400 to-yellow-500 text-black shadow-lg">
                      <reason.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">0{index + 1}</span>
                        <span className="h-px flex-1 bg-yellow-300/60" />
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-yellow-600">
                        {reason.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes whyus-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes card-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
}
