"use client";

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
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            How We Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our Process
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            A proven methodology that delivers results. From discovery to optimization, we&apos;ve got you covered every step of the way.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on Mobile */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-yellow-400"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Card */}
                <div className="bg-yellow-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-200 h-full">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-black font-bold text-2xl mb-4 shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <step.icon className="w-10 h-10 text-yellow-600" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Hidden on Mobile */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 text-yellow-400 text-4xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Every project is unique, and we adapt our process to fit your specific needs.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
