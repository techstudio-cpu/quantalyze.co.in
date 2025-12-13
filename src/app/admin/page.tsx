'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    visitors: 0,
    contactSubmissions: 0,
    newsletterSubscribers: 0,
    conversionRate: 0
  });
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch contact submissions
      const contactResponse = await fetch('/api/contact?limit=1000');
      const contactData = await contactResponse.json();
      const contactCount = contactData.success ? contactData.submissions.length : 0;

      // Fetch newsletter stats
      const newsletterResponse = await fetch('/api/newsletter');
      const newsletterData = await newsletterResponse.json();
      const newsletterCount = newsletterData.success ? newsletterData.stats.active : 0;

      // For demo purposes, set visitors and conversion rate
      // In a real app, you'd fetch analytics data
      const visitors = contactCount + Math.floor(Math.random() * 1000) + 500;
      const conversionRate = contactCount > 0 ? ((contactCount / visitors) * 100).toFixed(1) : 0;

      setDashboardData({
        visitors,
        contactSubmissions: contactCount,
        newsletterSubscribers: newsletterCount,
        conversionRate: parseFloat(conversionRate as string)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

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
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem('adminToken');
        }
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('adminToken');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem('adminToken', data.token);
        }
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('adminToken');
    }
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Quantalyze Digital Agency</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {username || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Visitors</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dataLoading ? '-' : dashboardData.visitors.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">
              {dataLoading ? 'Loading...' : 'Last 30 days'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Contact Submissions</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dataLoading ? '-' : dashboardData.contactSubmissions}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {dataLoading ? 'Loading...' : 'All time'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Newsletter Subscribers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dataLoading ? '-' : dashboardData.newsletterSubscribers}
            </p>
            <p className="text-sm text-purple-600 mt-2">
              {dataLoading ? 'Loading...' : 'Active subscribers'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dataLoading ? '-' : `${dashboardData.conversionRate}%`}
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              {dataLoading ? 'Loading...' : 'Contact / Visitors'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/contact-submissions"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center block"
            >
              View Contact Submissions
            </Link>
            <Link
              href="/admin/newsletter"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors text-center block"
            >
              View Newsletter Stats
            </Link>
            <Link
              href="/admin/analytics"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-center block"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/services"
              className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors text-center block"
            >
              Manage Services
            </Link>
            <Link
              href="/admin/courses"
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors text-center block"
            >
              Manage Courses
            </Link>
            <Link
              href="/admin/content"
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors text-center block"
            >
              Manage Content
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">🚀 Admin Panel Features</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>Newsletter subscription management</li>
            <li>Contact form submissions tracking</li>
            <li>Analytics and insights</li>
            <li>Service management</li>
            <li>Real-time monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
