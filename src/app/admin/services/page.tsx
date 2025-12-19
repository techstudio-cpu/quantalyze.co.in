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
  show_price?: boolean;
  featured: boolean;
  status: string;
  deleted_at?: string | null;
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    category: '',
    price: '',
    show_price: true,
    featured: false,
    status: 'active',
    points: [''],
    sub_services: [{ name: '', href: '', description: '' }]
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchServices();
    }
  }, [isAuthenticated, statusFilter, includeDeleted]);

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
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      const params = new URLSearchParams();
      params.set('status', statusFilter);
      if (includeDeleted) params.set('includeDeleted', 'true');
      const response = await fetch(`/api/services?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
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

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      category: service.category,
      price: service.price.toString(),
      show_price: service.show_price !== false,
      featured: service.featured,
      status: service.status,
      points: service.points.length > 0 ? service.points : [''],
      sub_services: service.sub_services.length > 0 ? service.sub_services : [{ name: '', href: '', description: '' }]
    });
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: '',
      category: '',
      price: '',
      show_price: true,
      featured: false,
      status: 'active',
      points: [''],
      sub_services: [{ name: '', href: '', description: '' }]
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const submissionData: any = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        show_price: !!formData.show_price,
        featured: formData.featured,
        status: formData.status,
        points: formData.points.filter(point => point.trim() !== ''),
        sub_services: formData.sub_services.filter(sub => sub.name.trim() !== '')
      };

      const url = editingService ? '/api/services' : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      if (editingService) {
        submissionData.id = editingService.id;
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
        setEditingService(null);
        setShowCreateForm(false);
        fetchServices();
      } else {
        setError(data.message || 'Failed to save service');
      }
    } catch (error) {
      setError('Error saving service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchServices();
      } else {
        setError(data.message || 'Failed to delete service');
      }
    } catch (error) {
      setError('Error deleting service');
    }
  };

  const handleRestore = async (serviceId: string) => {
    if (!confirm('Restore this service? It will be set to active.')) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: serviceId, restore: true })
      });
      const data = await response.json();
      if (data.success) {
        fetchServices();
      } else {
        setError(data.message || 'Failed to restore service');
      }
    } catch (error) {
      setError('Error restoring service');
    }
  };

  const addPoint = () => {
    setFormData(prev => ({
      ...prev,
      points: [...prev.points, '']
    }));
  };

  const removePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }));
  };

  const updatePoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.map((point, i) => i === index ? value : point)
    }));
  };

  const addSubService = () => {
    setFormData(prev => ({
      ...prev,
      sub_services: [...prev.sub_services, { name: '', href: '', description: '' }]
    }));
  };

  const removeSubService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sub_services: prev.sub_services.filter((_, i) => i !== index)
    }));
  };

  const updateSubService = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sub_services: prev.sub_services.map((sub, i) => 
        i === index ? { ...sub, [field]: value } : sub
      )
    }));
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
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={includeDeleted}
                  onChange={(e) => setIncludeDeleted(e.target.checked)}
                />
                <span>Include deleted</span>
              </label>
              <button
                onClick={fetchServices}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add New Service
              </button>
              <button
                onClick={initializeServices}
                disabled={isInitializing}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Services'}
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
                      {service.show_price !== false && (
                        <span className="text-sm text-gray-500">Price: ₹{service.price.toLocaleString()}</span>
                      )}
                      <span className={`text-sm px-2 py-1 rounded ${
                        service.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status}
                      </span>
                      {service.deleted_at && (
                        <span className="text-sm px-2 py-1 bg-gray-200 text-gray-800 rounded">
                          Deleted
                        </span>
                      )}
                      {service.featured && (
                        <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    {service.deleted_at ? (
                      <button
                        onClick={() => handleRestore(service.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Restore
                      </button>
                    ) : (
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
                    )}
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
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
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

        {(editingService || showCreateForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingService ? 'Edit Service' : 'Create New Service'}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <label className="flex items-center mt-7">
                      <input
                        type="checkbox"
                        checked={formData.show_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, show_price: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Show price on website</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., chart-line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Service</span>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Points
                    </label>
                    <button
                      type="button"
                      onClick={addPoint}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Point
                    </button>
                  </div>
                  {formData.points.map((point, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updatePoint(index, e.target.value)}
                        placeholder="Enter key point"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sub-Services
                    </label>
                    <button
                      type="button"
                      onClick={addSubService}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Sub-Service
                    </button>
                  </div>
                  {formData.sub_services.map((subService, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <input
                          type="text"
                          value={subService.name}
                          onChange={(e) => updateSubService(index, 'name', e.target.value)}
                          placeholder="Sub-service name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="url"
                          value={subService.href}
                          onChange={(e) => updateSubService(index, 'href', e.target.value)}
                          placeholder="URL (e.g., /service-name)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <textarea
                        value={subService.description}
                        onChange={(e) => updateSubService(index, 'description', e.target.value)}
                        placeholder="Sub-service description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.sub_services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubService(index)}
                          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Remove Sub-Service
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
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
                    {isSubmitting ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
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
