"use client";

import { FaRocket, FaArrowRight, FaStar, FaUsers, FaProjectDiagram, FaSmile } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-yellow-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-200 rounded-full opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Enhanced Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl mb-10 animate-fade-in border border-yellow-300 transform hover:scale-105 transition-all duration-300">
          <FaRocket className="text-white animate-pulse" />
          <span className="text-sm font-bold text-white tracking-wide">
            Your Premier Digital Growth Partner
          </span>
        </div>

        {/* Main Heading with Enhanced Animation */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight transition-all duration-1000 ease-out animate-fade-in-up">
          <span className="inline-block animate-slide-in-left">Transform Your Brand with</span><br />
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent inline-block animate-slide-in-right delay-300">
            Digital Excellence
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-12 max-w-4xl leading-relaxed animate-fade-in-up delay-500 font-light">
          Elevate your digital presence with our comprehensive suite of services.
          From strategic SEO to compelling branding, we drive measurable results.
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <ScrollLink
            to="contact"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full font-bold text-xl shadow-2xl hover:shadow-yellow-200/50 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center space-x-3 animate-pulse-on-hover"
          >
            <span>Start Your Journey</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </ScrollLink>
          <ScrollLink
            to="portfolio"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="px-10 py-5 bg-white text-gray-900 border-2 border-yellow-400 rounded-full font-bold text-xl hover:bg-yellow-50 hover:border-yellow-500 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Our Work
          </ScrollLink>
        </div>

        {/* Enhanced Stats with Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          {[
            { icon: FaProjectDiagram, number: "500+", label: "Projects Delivered", color: "text-blue-600" },
            { icon: FaUsers, number: "200+", label: "Happy Clients", color: "text-green-600" },
            { icon: FaStar, number: "50+", label: "Team Members", color: "text-purple-600" },
            { icon: FaSmile, number: "98%", label: "Client Satisfaction", color: "text-red-600" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-yellow-300 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <stat.icon className={`text-4xl ${stat.color} mb-4 mx-auto animate-bounce-in`} />
              <div className="text-4xl md:text-5xl font-black text-gray-900 mb-3 animate-count-up">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 border-3 border-gray-400 rounded-full flex items-start justify-center p-3 shadow-lg bg-white/50 backdrop-blur-sm">
          <div className="w-1.5 h-4 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
