"use client";

import { useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import { contactEmail } from '@/config/email';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const contactOptions = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://wa.me/919202509190",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Email",
      icon: FaEnvelope,
      href: `mailto:${contactEmail}`,
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      name: "Call",
      icon: FaPhone,
      href: "tel:+918770338369",
      color: "bg-gray-900 hover:bg-black",
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Contact Options */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col space-y-3 animate-fade-in">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 ${option.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <option.icon className="w-5 h-5" />
              <span className="font-semibold pr-2">{option.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-yellow-400 hover:bg-yellow-500"
        }`}
        aria-label="Contact options"
      >
        {isOpen ? (
          <a href={`mailto:${contactEmail}`} className="hidden md:inline-flex items-center gap-2 hover:text-yellow-700 transition-colors">
            <FaEnvelope className="text-yellow-600" /> {contactEmail}
          </a>
        ) : (
          <FaComments className="w-6 h-6 text-black" />
        )}
      </button>

      {/* Pulse Animation */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20"></div>
      )}
    </div>
  );
}
