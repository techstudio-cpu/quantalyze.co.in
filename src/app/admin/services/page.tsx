'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  featured: boolean;
  status: string;
  points: string[];
  sub_services: Array<{ name: string; href: string; description: string }>;
  created_at: string;
  updated_at: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
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
        fetchServices();
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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services);
      } else {
        setError('Failed to fetch services');
      }
    } catch (error) {
      setError('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const initializeServices = async () => {
    try {
      setIsInitializing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/admin/init-services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchServices();
      } else {
        setError('Failed to initialize services: ' + data.message);
      }
    } catch (error) {
      setError('Error initializing services');
    } finally {
      setIsInitializing(false);
    }
  };

  const toggleFeatured = async (serviceId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: serviceId,
          featured: !services.find(s => s.id === serviceId)?.featured
        })
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      setError('Error updating service');
    }
  };

  const toggleStatus = async (serviceId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      const service = services.find(s => s.id === serviceId);
      
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: serviceId,
          status: service?.status === 'active' ? 'inactive' : 'active'
        })
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      setError('Error updating service');
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
              <span className="text-gray-600">Services Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Services Management</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Manage your services, pricing, and featured status
            </p>
            <button
              onClick={initializeServices}
              disabled={isInitializing}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Services'}
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
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              Get started by initializing the services data
            </p>
            <button
              onClick={initializeServices}
              disabled={isInitializing}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Services'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mt-1">{service.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Category: {service.category}</span>
                      <span className="text-sm text-gray-500">Price: ₹{service.price.toLocaleString()}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        service.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status}
                      </span>
                      {service.featured && (
                        <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFeatured(service.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        service.featured
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {service.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => toggleStatus(service.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        service.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } transition-colors`}
                    >
                      {service.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>

                {service.points && service.points.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {service.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.sub_services && service.sub_services.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sub-Services:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {service.sub_services.map((subService, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <h5 className="text-sm font-medium text-gray-900">{subService.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{subService.description}</p>
                          <a 
                            href={subService.href} 
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 block"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {subService.href}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Created: {new Date(service.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(service.updated_at).toLocaleDateString()}</span>
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
