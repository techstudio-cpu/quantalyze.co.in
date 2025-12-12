"use client";

import { FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Built a scalable e-commerce platform with advanced features and seamless user experience.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Social Media Campaign",
    category: "Digital Marketing",
    description: "Created a viral social media campaign that reached 5M+ users and increased brand awareness by 400%.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    tags: ["Instagram", "TikTok", "Content Strategy"],
  },
  {
    title: "Brand Identity Redesign",
    category: "Branding",
    description: "Complete brand overhaul including logo, color palette, and brand guidelines for a tech startup.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    tags: ["Logo Design", "Brand Strategy", "Guidelines"],
  },
  {
    title: "SEO Transformation",
    category: "SEO",
    description: "Boosted organic traffic by 500% through comprehensive SEO strategy and technical optimization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["Technical SEO", "Content", "Analytics"],
  },
  {
    title: "Mobile App Development",
    category: "App Development",
    description: "Developed a feature-rich mobile app for iOS and Android with 100K+ downloads in 3 months.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    tags: ["React Native", "Firebase", "UX Design"],
  },
  {
    title: "Video Marketing Campaign",
    category: "Content Creation",
    description: "Produced a series of engaging video content that generated 10M+ views across platforms.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop",
    tags: ["Video Production", "YouTube", "Storytelling"],
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            Our Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Portfolio Highlights
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore some of our recent projects and see how we&apos;ve helped brands achieve their digital goals.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-200"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                  <FaExternalLinkAlt className="text-black text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-sm font-semibold text-yellow-600 mb-2">
                  {project.category}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">
                  {project.title}
                </h4>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-yellow-100 text-gray-900 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <div className="flex items-center text-yellow-600 font-semibold group-hover:gap-2 transition-all cursor-pointer">
                  <span>View Project</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Want to see more of our work?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Request Full Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
