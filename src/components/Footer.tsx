"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaHeart } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about/" },
      { name: "Our Team", href: "/about/" },
      { name: "Careers", href: "/about/" },
      { name: "Contact", href: "/contact/" },
    ],
    services: [
      { name: "Digital Marketing", href: "/services/" },
      { name: "Web Development", href: "/services/" },
      { name: "SEO Services", href: "/services/" },
      { name: "Brand Strategy", href: "/services/" },
    ],
    resources: [
      { name: "Blog", href: "/" },
      { name: "Testimonials", href: "/testimonials/" },
      { name: "FAQ", href: "/" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy/" },
      { name: "Terms & Conditions", href: "/terms-and-conditions/" },
      { name: "Disclaimer", href: "/disclaimer/" },
      { name: "Cookie Policy", href: "/" },
    ],
  };

  const socialLinks = [
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/quantalyze/", color: "hover:text-pink-600" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/company/elevatia-private-limited/", color: "hover:text-blue-700" },
    { name: "Facebook", icon: FaFacebook, href: "https://facebook.com", color: "hover:text-blue-600" },
    { name: "Twitter", icon: FaTwitter, href: "https://twitter.com", color: "hover:text-blue-400" },
    { name: "YouTube", icon: FaYoutube, href: "https://youtube.com", color: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-white border-t-2 border-yellow-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/quantalyze.png" 
                alt="Quantalyze Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Your trusted partner in digital transformation. We help brands connect with their audience through innovative marketing strategies and cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-yellow-100 text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:bg-yellow-200`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-yellow-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-gray-900 font-bold text-lg mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-gray-700">Get the latest updates and insights delivered to your inbox.</p>
            </div>
            <ScrollLink
              to="newsletter"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="px-6 py-3 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Subscribe Now
            </ScrollLink>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-700 text-sm mb-4 md:mb-0">
              {currentYear} Quantalyze. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-4 md:mb-0">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Technology Partner */}
            <div className="text-sm text-gray-700 flex items-center">
              <span>Technology Partner: </span>
              <a 
                href="https://techstudio.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 font-semibold text-yellow-700 hover:text-yellow-800 underline"
              >
                Tech Studio
              </a>
              <FaHeart className="ml-1 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

