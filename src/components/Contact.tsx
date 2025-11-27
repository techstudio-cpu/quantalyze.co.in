"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      // EmailJS configuration - Replace with your actual EmailJS credentials
      // import emailjs from "@emailjs/browser";
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   data,
      //   'YOUR_PUBLIC_KEY'
      // );

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      reset();
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase mb-3">
            Get In Touch
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Let&apos;s Start Your Project
          </h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ready to take your digital presence to the next level? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-8 shadow-xl border border-yellow-200">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-4">
                  Message Sent Successfully!
                </h4>
                <p className="text-lg text-gray-700">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                      Company Name
                    </label>
                    <input
                      {...register("company")}
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-900 mb-2">
                    Service Interested In *
                  </label>
                  <select
                    {...register("service", { required: "Please select a service" })}
                    id="service"
                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  >
                    <option value="">Select a service...</option>
                    <option value="social-media">Social Media Marketing</option>
                    <option value="seo">SEO Optimization</option>
                    <option value="web-dev">Web Development</option>
                    <option value="content">Content Creation</option>
                    <option value="branding">Brand Identity</option>
                    <option value="paid-ads">Paid Advertising</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-xl hover:bg-yellow-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-8 shadow-lg border border-yellow-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-black text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Email</div>
                    <a href="mailto:info@quantalyze.co.in" className="text-yellow-700 hover:text-yellow-800 hover:underline">
                      info@quantalyze.co.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaPhone className="text-black text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Phone</div>
                    <a href="tel:+918770338369" className="text-yellow-700 hover:text-yellow-800 hover:underline block">
                      +91 8770338369
                    </a>
                    <a href="tel:+916357410889" className="text-yellow-700 hover:text-yellow-800 hover:underline block">
                      +91 6357410889
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-black text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Address</div>
                    <p className="text-gray-700">
                      Remote Digital Agency<br />
                      Serving Clients Worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-8 shadow-lg border border-yellow-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                Office Hours
              </h4>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>10:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-yellow-400 rounded-2xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-black mb-3">
                Quick Response Guaranteed
              </h4>
              <p className="text-gray-900">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
