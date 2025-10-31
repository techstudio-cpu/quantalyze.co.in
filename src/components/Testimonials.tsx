"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CEO, TechVision Solutions",
    image: "https://ui-avatars.com/api/?name=Rahul+Sharma&size=150&background=fcd34d&color=000&bold=true",
    content: "Quantalyze transformed our digital presence completely. Their strategic approach to social media marketing resulted in a 300% increase in engagement within just 3 months. Absolutely phenomenal work!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Marketing Director, StyleHub India",
    image: "https://ui-avatars.com/api/?name=Priya+Patel&size=150&background=fbbf24&color=000&bold=true",
    content: "Working with Quantalyze has been a game-changer for our brand. Their team's creativity and data-driven approach helped us achieve our best quarter yet. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Founder, GreenLeaf Enterprises",
    image: "https://ui-avatars.com/api/?name=Amit+Kumar&size=150&background=f59e0b&color=000&bold=true",
    content: "The web development team at Quantalyze is top-notch. They delivered a stunning, user-friendly website that perfectly captures our brand essence. Our conversion rates have doubled!",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "CMO, FitIndia Wellness",
    image: "https://ui-avatars.com/api/?name=Sneha+Reddy&size=150&background=fde68a&color=000&bold=true",
    content: "Quantalyze's SEO expertise took our organic traffic from zero to hero. We now rank on the first page for all our target keywords. The ROI has been incredible!",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Owner, Swaad Bakery & Cafe",
    image: "https://ui-avatars.com/api/?name=Vikram+Singh&size=150&background=fcd34d&color=000&bold=true",
    content: "As a small business owner, I was skeptical about digital marketing. Quantalyze proved me wrong with their personalized approach and measurable results. Worth every penny!",
    rating: 5,
  },
  {
    name: "Anjali Mehta",
    role: "VP Marketing, Innovate Tech India",
    image: "https://ui-avatars.com/api/?name=Anjali+Mehta&size=150&background=fbbf24&color=000&bold=true",
    content: "Professional, responsive, and results-driven. Quantalyze has become an integral part of our marketing team. Their insights and execution are consistently excellent.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            Client Success Stories
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            What Our Clients Say
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about working with Quantalyze.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative border border-yellow-200"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-yellow-200 opacity-50">
                <FaQuoteLeft className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-900 leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-yellow-400"
                />
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to become our next success story?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}
