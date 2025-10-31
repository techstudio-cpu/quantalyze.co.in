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

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-gradient-to-br from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            Why Choose Us
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Why Quantalyze?
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Partner with a team that&apos;s committed to your success and has a proven track record of delivering exceptional results.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-yellow-400 rounded-xl">
                    <reason.icon className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {reason.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-yellow-400 rounded-2xl p-12 shadow-2xl">
          <h4 className="text-3xl font-bold text-black mb-4">
            Ready to Experience the Difference?
          </h4>
          <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have transformed their digital presence with Quantalyze.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}
