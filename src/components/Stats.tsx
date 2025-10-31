"use client";

import { useEffect, useState, useRef } from "react";
import { FaChartLine, FaUsers, FaTrophy, FaHeart } from "react-icons/fa";

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  end: number;
  label: string;
  suffix: string;
}

const stats: StatItem[] = [
  {
    icon: FaChartLine,
    end: 500,
    label: "Projects Completed",
    suffix: "+",
  },
  {
    icon: FaUsers,
    end: 200,
    label: "Happy Clients",
    suffix: "+",
  },
  {
    icon: FaTrophy,
    end: 25,
    label: "Awards Won",
    suffix: "+",
  },
  {
    icon: FaHeart,
    end: 98,
    label: "Client Satisfaction",
    suffix: "%",
  },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, end]);

  return (
    <div ref={counterRef} className="text-5xl md:text-6xl font-bold">
      {count}{suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="py-20 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase mb-3">
            Our Impact
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Numbers That Speak
          </h3>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Years of excellence delivering measurable results for our clients.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-6">
                <stat.icon className="w-8 h-8 text-black" />
              </div>

              {/* Counter */}
              <div className="text-black mb-2">
                <Counter end={stat.end} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-lg font-medium text-gray-900">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
