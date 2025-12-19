"use client";

import { useEffect, useState } from 'react';

type Course = {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  show_price?: boolean;
  duration?: string;
  level?: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        const response = await fetch('/api/courses', { cache: 'no-store' });
        const data = await response.json();
        if (mounted && data?.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      } catch {
        // Keep page usable even if API fails
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in">Digital Marketing Courses</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Learn Digital, Earn Digital, Live Digital with our comprehensive courses.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {(courses || []).map((course) => (
                <div key={course.id} className="bg-white border border-yellow-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-700 mb-4">{course.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {!!course.duration && (
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                        {course.duration}
                      </div>
                    )}
                    {!!course.level && (
                      <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">
                        {course.level}
                      </div>
                    )}
                    {!!course.category && (
                      <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">
                        {course.category}
                      </div>
                    )}
                    {!!course.show_price && course.price !== undefined && course.price !== null && (
                      <div className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full font-semibold">
                        ₹{Number(course.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button className="mt-6 w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Learn With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Expert Instructors", desc: "Learn from industry professionals with years of experience" },
              { title: "Practical Training", desc: "Hands-on projects and real-world case studies" },
              { title: "Placement Support", desc: "Career guidance and placement assistance" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
