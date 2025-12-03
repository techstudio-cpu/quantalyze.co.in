"use client";

import { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use main newsletter endpoint in environments where the API is available
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: ['digital-trends', 'marketing-insights', 'ai-updates']
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setEmail("");
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        // Handle error cases
        if (data.alreadySubscribed) {
          alert(data.message);
        } else {
          alert(`Subscription failed: ${data.message}`);
        }
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-yellow-400">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isSuccess ? (
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h3 className="text-4xl font-bold text-black mb-4">
              You&apos;re All Set!
            </h3>
            <p className="text-xl text-gray-900">
              Thank you for subscribing. Check your inbox for a welcome email.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
              Stay Updated with Digital Trends
            </h3>
            <p className="text-xl text-gray-900 mb-8">
              Subscribe to our newsletter for the latest insights, tips, and exclusive offers delivered to your inbox.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">📈 Marketing Insights</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">🤖 AI Updates</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">📊 Digital Trends</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">🎯 Exclusive Offers</span>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white focus:ring-4 focus:ring-yellow-200 focus:outline-none transition border-2 border-transparent placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <FaPaperPlane />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-gray-900">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
