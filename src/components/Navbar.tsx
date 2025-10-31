"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", href: "hero" },
    { name: "Services", href: "services" },
    { name: "Why Us", href: "why-us" },
    { name: "Process", href: "process" },
    { name: "Portfolio", href: "portfolio" },
    { name: "Testimonials", href: "testimonials" },
    { name: "Contact", href: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-yellow-200 shadow-lg md:rounded-b-3xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/quantalyze.png"
              alt="Quantalyze Logo"
              className="h-10 w-auto rounded-full bg-white ring-2 ring-yellow-300 ring-offset-2 ring-offset-white shadow-md group-hover:scale-105 transition-all duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.name}
                to={link.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="relative px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:text-yellow-600 transition cursor-pointer group"
                activeClass="text-yellow-700"
              >
                <span
                  className="group-hover:underline group-hover:underline-offset-8 group-hover:decoration-2 group-hover:decoration-yellow-400 transition-all duration-200"
                >{link.name}</span>
              </ScrollLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ScrollLink
              to="contact"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="px-6 py-2 bg-yellow-400 text-black rounded-full font-bold ring-2 ring-yellow-300 ring-offset-2 hover:bg-yellow-500 hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer shadow-md"
            >
              Get Started
            </ScrollLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-900 hover:bg-yellow-50 shadow-sm focus:ring-2 focus:ring-yellow-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-yellow-200 animate-fade-in-down shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.name}
                to={link.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition cursor-pointer"
              >
                {link.name}
              </ScrollLink>
            ))}
            <ScrollLink
              to="contact"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={closeMenu}
              className="block w-full mt-2 px-3 py-2 text-center bg-yellow-400 text-black rounded-full font-bold cursor-pointer hover:bg-yellow-500 ring-2 ring-yellow-300"
            >
              Get Started
            </ScrollLink>
          </div>
        </div>
      )}
    </nav>
  );
}

