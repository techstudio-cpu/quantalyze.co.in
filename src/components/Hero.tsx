"use client";

import { FaRocket, FaArrowRight } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">

      <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 animate-fade-in border border-yellow-200">
          <FaRocket className="text-yellow-600" />
          <span className="text-sm font-semibold text-gray-900">
            Your Digital Growth Partner
          </span>
        </div>
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight transition-all duration-700 ease-out animate-fade-in-up">
          <span className="inline-block animate-fade-in-up delay-100">Transform Your Brand with </span>{" "}
          <span className="text-yellow-600 inline-block animate-fade-in-up delay-200">Digital Excellence</span>
        </h1>
        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl">
          Connect with your audience through authentic social experiences. 
          We deliver cutting-edge SEO, SMM, Analytics, and Branding solutions.
        </p>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <ScrollLink
            to="contact"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="group px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </ScrollLink>
          <ScrollLink
            to="portfolio"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="px-8 py-4 bg-white text-gray-900 border-2 border-yellow-400 rounded-full font-bold text-lg hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            View Our Work
          </ScrollLink>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center justify-center items-center">
          {[
            { number: "500+", label: "Projects Delivered" },
            { number: "200+", label: "Happy Clients" },
            { number: "50+", label: "Team Members" },
            { number: "98%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200"
            >
              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
