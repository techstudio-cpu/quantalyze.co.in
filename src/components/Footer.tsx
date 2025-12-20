"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaHeart } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { useEffect, useMemo, useState } from "react";

type FooterLink = { name: string; href: string };

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const defaultFooterSettings = {
    brandText:
      "Your trusted partner in digital transformation. We help brands connect with their audience through innovative marketing strategies and cutting-edge technology.",
    socials: {
      instagram: "https://www.instagram.com/quantalyze/",
      linkedin: "https://www.linkedin.com/company/elevatia-private-limited/",
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com",
    },
    links: {
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
    },
    newsletterCta: {
      title: "Subscribe to Our Newsletter",
      subtitle: "Get the latest updates and insights delivered to your inbox.",
      buttonText: "Subscribe Now",
    },
    technologyPartner: {
      label: "Technology Partner:",
      name: "Tech Studio",
      url: "https://techstudio.co.in",
    },
  };

  const [footerSettings, setFooterSettings] = useState<any>(defaultFooterSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/site-settings?scope=footer");
        const data = await response.json();
        if (data?.success && data?.settings) {
          setFooterSettings(data.settings);
        }
      } catch {
        setFooterSettings(defaultFooterSettings);
      }
    };

    fetchSettings();
  }, []);

  const footerLinks = footerSettings?.links || defaultFooterSettings.links;
  const companyLinks: FooterLink[] = Array.isArray(footerLinks?.company) ? (footerLinks.company as FooterLink[]) : defaultFooterSettings.links.company;
  const servicesLinks: FooterLink[] = Array.isArray(footerLinks?.services) ? (footerLinks.services as FooterLink[]) : defaultFooterSettings.links.services;
  const resourcesLinks: FooterLink[] = Array.isArray(footerLinks?.resources) ? (footerLinks.resources as FooterLink[]) : defaultFooterSettings.links.resources;
  const legalLinks: FooterLink[] = Array.isArray(footerLinks?.legal) ? (footerLinks.legal as FooterLink[]) : defaultFooterSettings.links.legal;

  const socialLinks = useMemo(() => {
    const socials = footerSettings?.socials || defaultFooterSettings.socials;
    return [
      { name: "Instagram", icon: FaInstagram, href: socials.instagram, color: "hover:text-pink-600" },
      { name: "LinkedIn", icon: FaLinkedin, href: socials.linkedin, color: "hover:text-blue-700" },
      { name: "Facebook", icon: FaFacebook, href: socials.facebook, color: "hover:text-blue-600" },
      { name: "Twitter", icon: FaTwitter, href: socials.twitter, color: "hover:text-blue-400" },
      { name: "YouTube", icon: FaYoutube, href: socials.youtube, color: "hover:text-red-600" },
    ].filter((s) => Boolean(s.href));
  }, [footerSettings]);

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
              {footerSettings?.brandText || defaultFooterSettings.brandText}
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
              {companyLinks.map((link: FooterLink) => (
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
              {servicesLinks.map((link: FooterLink) => (
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
              {resourcesLinks.map((link: FooterLink) => (
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
              <h4 className="text-gray-900 font-bold text-lg mb-2">{footerSettings?.newsletterCta?.title || defaultFooterSettings.newsletterCta.title}</h4>
              <p className="text-gray-700">{footerSettings?.newsletterCta?.subtitle || defaultFooterSettings.newsletterCta.subtitle}</p>
            </div>
            <ScrollLink
              to="newsletter"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="px-6 py-3 bg-yellow-400 text-black rounded-full font-bold hover:bg-yellow-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {footerSettings?.newsletterCta?.buttonText || defaultFooterSettings.newsletterCta.buttonText}
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
              {legalLinks.map((link: FooterLink) => (
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
              <span>{footerSettings?.technologyPartner?.label || defaultFooterSettings.technologyPartner.label} </span>
              <a 
                href={footerSettings?.technologyPartner?.url || defaultFooterSettings.technologyPartner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 font-semibold text-yellow-700 hover:text-yellow-800 underline"
              >
                {footerSettings?.technologyPartner?.name || defaultFooterSettings.technologyPartner.name}
              </a>
              <FaHeart className="ml-1 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

