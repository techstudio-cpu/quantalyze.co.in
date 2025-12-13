'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  level: string;
  featured: boolean;
  status: string;
  modules: number;
  enrolled_students: number;
  created_at: string;
  updated_at: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
    if (token) {
      verifyToken(token);
    } else {
      router.push('/admin');
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchCourses();
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem('adminToken');
        }
        router.push('/admin');
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('adminToken');
      }
      router.push('/admin');
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      setError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const initializeCourses = async () => {
    try {
      setIsInitializing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/admin/init-courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchCourses();
      } else {
        setError('Failed to initialize courses: ' + data.message);
      }
    } catch (error) {
      setError('Error initializing courses');
    } finally {
      setIsInitializing(false);
    }
  };

  const toggleFeatured = async (courseId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: courseId,
          featured: !courses.find(c => c.id === courseId)?.featured
        })
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      setError('Error updating course');
    }
  };

  const toggleStatus = async (courseId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      const course = courses.find(c => c.id === courseId);
      
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: courseId,
          status: course?.status === 'active' ? 'inactive' : 'active'
        })
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      setError('Error updating course');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                ← Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Courses Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses Management</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Manage your courses, pricing, and featured status
            </p>
            <button
              onClick={initializeCourses}
              disabled={isInitializing}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Courses'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              Get started by initializing the courses data
            </p>
            <button
              onClick={initializeCourses}
              disabled={isInitializing}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Courses'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-gray-600 mt-1">{course.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Category: {course.category}</span>
                      <span className="text-sm text-gray-500">Price: ₹{course.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">Duration: {course.duration}</span>
                      <span className="text-sm text-gray-500">Level: {course.level}</span>
                      <span className="text-sm text-gray-500">Modules: {course.modules}</span>
                      <span className="text-sm text-gray-500">Students: {course.enrolled_students}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFeatured(course.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        course.featured
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {course.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => toggleStatus(course.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        course.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } transition-colors`}
                    >
                      {course.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`text-sm px-2 py-1 rounded ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                  {course.featured && (
                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(course.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
