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
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    level: 'beginner',
    featured: false,
    status: 'active',
    modules: 1,
    enrolled_students: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price.toString(),
      duration: course.duration,
      level: course.level,
      featured: course.featured,
      status: course.status,
      modules: course.modules,
      enrolled_students: course.enrolled_students
    });
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      level: 'beginner',
      featured: false,
      status: 'active',
      modules: 1,
      enrolled_students: 0
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const submissionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        duration: formData.duration,
        level: formData.level,
        featured: formData.featured,
        status: formData.status,
        modules: parseInt(formData.modules.toString()) || 1,
        enrolled_students: parseInt(formData.enrolled_students.toString()) || 0
      };

      const url = editingCourse ? '/api/courses' : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      
      if (editingCourse) {
        submissionData.id = editingCourse.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();
      
      if (data.success) {
        setEditingCourse(null);
        setShowCreateForm(false);
        fetchCourses();
      } else {
        setError(data.message || 'Failed to save course');
      }
    } catch (error) {
      setError('Error saving course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchCourses();
      } else {
        setError(data.message || 'Failed to delete course');
      }
    } catch (error) {
      setError('Error deleting course');
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
            <div className="flex space-x-3">
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add New Course
              </button>
              <button
                onClick={initializeCourses}
                disabled={isInitializing}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Courses'}
              </button>
            </div>
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
                      onClick={() => handleEdit(course)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
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
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
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

        {(editingCourse || showCreateForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 6 weeks, 3 months"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modules
                    </label>
                    <input
                      type="number"
                      value={formData.modules}
                      onChange={(e) => setFormData(prev => ({ ...prev, modules: parseInt(e.target.value) || 1 }))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Course</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrolled Students
                    </label>
                    <input
                      type="number"
                      value={formData.enrolled_students}
                      onChange={(e) => setFormData(prev => ({ ...prev, enrolled_students: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourse(null);
                      setShowCreateForm(false);
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
