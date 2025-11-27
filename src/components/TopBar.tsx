"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="w-full bg-white border-b border-yellow-200 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-gray-800">
          <a href="tel:+918770338369" className="inline-flex items-center gap-2 hover:text-yellow-700 transition-colors">
            <FaPhoneAlt className="text-yellow-600" /> +91 8770338369
          </a>
          <a href="tel:+916357410889" className="hidden lg:inline-flex items-center gap-2 hover:text-yellow-700 transition-colors">
            <FaPhoneAlt className="text-yellow-600" /> +91 6357410889
          </a>
          <a href="mailto:info@quantalyze.co.in" className="hidden md:inline-flex items-center gap-2 hover:text-yellow-700 transition-colors">
            <FaEnvelope className="text-yellow-600" /> info@quantalyze.co.in
          </a>
        </div>
        <div className="flex items-center gap-3 text-gray-800">
          <a href="#" className="transition-colors hover:text-yellow-700" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" className="transition-colors hover:text-yellow-700" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://www.instagram.com/quantalyze/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow-700" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://www.linkedin.com/company/elevatia-private-limited/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow-700" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
    </div>
  );
}
