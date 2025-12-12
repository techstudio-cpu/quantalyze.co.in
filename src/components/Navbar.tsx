"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks: Array<
    | { name: string; type: "scroll"; href: string }
    | { name: string; type: "link"; href: string; external?: boolean }
  > = [
    { name: "Home", type: "link", href: "/" },
    { name: "About Us", type: "link", href: "/about/" },
    { name: "Courses", type: "link", href: "/courses/" },
    { name: "Services", type: "link", href: "/services/" },
    { name: "Contact", type: "link", href: "/contact/" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-yellow-200 shadow-lg md:rounded-b-3xl transition-all duration-300 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/quantalyze.png"
              alt="Quantalyze Logo"
              className="h-10 w-auto rounded-full bg-white ring-2 ring-yellow-300 ring-offset-2 ring-offset-white shadow-md group-hover:scale-105 transition-all duration-200"
              loading="lazy"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              link.type === "scroll" ? (
                <ScrollLink
                  key={link.name}
                  to={link.href}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="relative px-4 py-2 rounded-md text-sm font-semibold text-gray-900 hover:text-yellow-600 transition cursor-pointer group min-h-[44px] flex items-center justify-center"
                  activeClass="text-yellow-700"
                >
                  <span className="group-hover:underline group-hover:underline-offset-8 group-hover:decoration-2 group-hover:decoration-yellow-400 transition-all duration-200">{link.name}</span>
                </ScrollLink>
              ) : link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:text-yellow-600 transition cursor-pointer group"
                >
                  <span className="group-hover:underline group-hover:underline-offset-8 group-hover:decoration-2 group-hover:decoration-yellow-400 transition-all duration-200">{link.name}</span>
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 rounded-md text-sm font-semibold text-gray-900 hover:text-yellow-600 transition cursor-pointer group min-h-[44px] flex items-center justify-center"
                >
                  <span className="group-hover:underline group-hover:underline-offset-8 group-hover:decoration-2 group-hover:decoration-yellow-400 transition-all duration-200">{link.name}</span>
                </Link>
              )
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
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[44px] min-w-[44px]"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 border border-yellow-200/50">
          {navLinks.map((link) => (
            link.type === "scroll" ? (
              <ScrollLink
                key={link.name}
                to={link.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition min-h-[44px] flex items-center cursor-pointer"
              >
                {link.name}
              </ScrollLink>
            ) : link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-yellow-600 hover:bg-yellow-50 transition min-h-[44px] flex items-center cursor-pointer"
              >
                {link.name}
              </Link>
            )
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
    </nav>
  );
}

