"use client";

import { 
  FaBullhorn, 
  FaPenNib, 
  FaChartLine, 
  FaUsers, 
  FaSearch, 
  FaComments, 
  FaCode, 
  FaPalette,
  FaVideo,
  FaMobileAlt,
  FaEnvelope,
  FaGlobe
} from "react-icons/fa";

const services = [
  { 
    name: "Social Media Strategy", 
    icon: FaBullhorn,
    description: "Data-driven strategies to amplify your brand's social presence and engagement.",
  },
  { 
    name: "Content Creation", 
    icon: FaPenNib,
    description: "Compelling content that tells your story and resonates with your audience.",
  },
  { 
    name: "Paid Advertising", 
    icon: FaChartLine,
    description: "ROI-focused ad campaigns across Google, Facebook, Instagram, and more.",
  },
  { 
    name: "Influencer Marketing", 
    icon: FaUsers,
    description: "Connect with the right influencers to expand your brand's reach.",
  },
  { 
    name: "SEO Optimization", 
    icon: FaSearch,
    description: "Rank higher on search engines and drive organic traffic to your site.",
  },
  { 
    name: "Community Management", 
    icon: FaComments,
    description: "Build and nurture engaged communities around your brand.",
  },
  { 
    name: "Web Development", 
    icon: FaCode,
    description: "Custom websites and web applications built with modern technologies.",
  },
  { 
    name: "Brand Identity", 
    icon: FaPalette,
    description: "Create memorable brand identities that stand out in the market.",
  },
  { 
    name: "Video Production", 
    icon: FaVideo,
    description: "Professional video content that captures attention and tells your story.",
  },
  { 
    name: "Mobile App Development", 
    icon: FaMobileAlt,
    description: "Native and cross-platform mobile apps for iOS and Android.",
  },
  { 
    name: "Email Marketing", 
    icon: FaEnvelope,
    description: "Targeted email campaigns that convert subscribers into customers.",
  },
  { 
    name: "Analytics & Reporting", 
    icon: FaGlobe,
    description: "Comprehensive insights and reporting to measure your digital success.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3 animate-slide-in-left">
            What We Offer
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-up delay-200">
            Our Services
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-fade-in-up delay-400">
            Comprehensive digital marketing and development solutions tailored to help your brand thrive in the digital landscape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-yellow-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 border border-yellow-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="inline-flex p-4 rounded-xl bg-yellow-400 mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-bounce-in">
                <service.icon className="w-8 h-8 text-black" />
              </div>

              {/* Content */}
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-700 transition-colors duration-300">
                {service.name}
              </h4>
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                {service.description}
              </p>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Ready to elevate your digital presence?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Let&apos;s Work Together
          </a>
        </div>
      </div>
    </section>
  );
}
