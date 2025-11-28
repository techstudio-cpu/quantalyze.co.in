'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiPlusCircle, FiRefreshCw } from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';

interface Service {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  href: string;
  subServices: string[];
  order: number;
  price?: string;
}

// Main website services data
const mainWebsiteServices = [
  {
    name: "Automation Workflow / AI Agents",
    icon: "🤖",
    tagline: "Automate customer journeys with AI-first workflows.",
    href: "/services/ai-automation/",
    subServices: [
      "AI Agents & Copilots",
      "Workflow Automation (n8n, Zapier)",
      "Custom Chatbots",
      "Analytics Dashboards",
    ],
    order: 1
  },
  {
    name: "Digital Marketing",
    icon: "📢",
    tagline: "Performance marketing that turns attention into revenue.",
    href: "/services/",
    subServices: [
      "Social Media Campaigns",
      "Content & Influencer Strategy",
      "SEO & ASO",
      "Performance Ads",
    ],
    order: 2
  },
  {
    name: "Web / App Development",
    icon: "💻",
    tagline: "High-converting web and mobile experiences built fast.",
    href: "/services/website-development/",
    subServices: [
      "Corporate Websites",
      "Ecommerce Stores",
      "Progressive Web Apps",
      "Mobile Apps (iOS & Android)",
    ],
    order: 3
  },
  {
    name: "Branding",
    icon: "🎨",
    tagline: "Bold identities that stay consistent across every touchpoint.",
    href: "/services/graphics-design/",
    subServices: [
      "Brand Strategy Sprints",
      "Visual Identity Design",
      "Packaging & Collateral",
      "Brand Playbooks",
    ],
    order: 4
  },
  {
    name: "Lead Generation",
    icon: "📈",
    tagline: "Demand engines that keep your pipeline full.",
    href: "/#contact",
    subServices: [
      "Paid Media Funnels",
      "Landing Page Optimization",
      "CRM & Marketing Automation",
      "Sales Enablement Content",
    ],
    order: 5
  },
  {
    name: "Global Expansion (GEO)",
    icon: "🌍",
    tagline: "Localized playbooks to win in every market you enter.",
    href: "/#contact",
    subServices: [
      "Market Localization",
      "Regional Campaign Management",
      "Multi-language SEO",
      "Partnership Activation",
    ],
    order: 6
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    tagline: '',
    icon: '🌐',
    href: '/services/',
    subServices: [],
    order: 1,
    price: undefined
  });
  const [newFeature, setNewFeature] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setServices(data.data);
        } else {
          // If no services in DB, use the main website services
          const servicesWithId = mainWebsiteServices.map(service => ({
            ...service,
            id: Math.random().toString(36).substr(2, 9)
          }));
          setServices(servicesWithId);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to main website services if API fails
        const servicesWithId = mainWebsiteServices.map(service => ({
          ...service,
          id: Math.random().toString(36).substr(2, 9)
        }));
        setServices(servicesWithId);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingService ? 'PATCH' : 'POST';
      const url = editingService 
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save service');
      
      // Refresh services after successful save
      const servicesResponse = await fetch('/api/admin/services');
      const servicesData = await servicesResponse.json();
      
      if (servicesData.success) {
        setServices(servicesData.data || []);
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({
        name: '',
        tagline: '',
        icon: '🌐',
        href: '/services/',
        subServices: [],
        order: services.length + 1,
        price: undefined
      });
      
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');
      
      // Refresh services after successful deletion
      const servicesResponse = await fetch('/api/admin/services');
      const servicesData = await servicesResponse.json();
      
      if (servicesData.success) {
        setServices(servicesData.data || []);
      }
      
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const handleAddSubService = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        subServices: [...formData.subServices, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeSubService = (index: number) => {
    const updatedSubServices = [...formData.subServices];
    updatedSubServices.splice(index, 1);
    setFormData({ ...formData, subServices: updatedSubServices });
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      tagline: service.tagline,
      icon: service.icon,
      href: service.href,
      subServices: [...service.subServices],
      price: service.price,
      order: service.order
    });
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(service => {
    const searchTermLower = searchTerm.toLowerCase();
    const name = service.name?.toLowerCase() || '';
    const tagline = service.tagline?.toLowerCase() || '';
    const subServices = service.subServices || [];
    
    return name.includes(searchTermLower) ||
           tagline.includes(searchTermLower) ||
           subServices.some(sub => 
             sub?.toLowerCase().includes(searchTermLower)
           );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Services Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={async () => {
                // Sync with main website services
                try {
                  const response = await fetch('/api/admin/services/sync', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ services: mainWebsiteServices })
                  });
                  
                  if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                      setServices(result.data);
                      alert('Services synced with main website successfully!');
                    }
                  }
                } catch (error) {
                  console.error('Error syncing services:', error);
                  alert('Failed to sync services. Please try again.');
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiRefreshCw className="mr-2" /> Sync with Main Site
            </button>
            <button
              onClick={() => {
                setEditingService(null);
                setFormData({
                  name: '',
                  tagline: '',
                  icon: '🌐',
                  href: '/services/',
                  subServices: [],
                  order: services.length + 1,
                  price: undefined
                });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Add New Service
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-3xl">
                    {service.icon}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.tagline}</p>
                
                {/* Price Display */}
                {service.price && (
                  <div className="mb-4">
                    <div className="flex items-center">
                      <FaIndianRupeeSign className="text-green-600 mr-1" />
                      <span className="text-2xl font-bold text-green-600">
                        {service.price}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Sub-Services:</h4>
                  <ul className="space-y-1">
                    {service.subServices.map((subService, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-600">{subService}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Service Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingService(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline *
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (INR)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIndianRupeeSign className="text-gray-500" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price || ''}
                          onChange={(e) => 
                            setFormData({ 
                              ...formData, 
                              price: e.target.value || undefined 
                            })
                          }
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page URL *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        {typeof window !== 'undefined' ? window.location.origin : ''}
                      </span>
                      <input
                        type="text"
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="/services/service-name/"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="🌐"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter an emoji icon (e.g., 🌐, 📱, 🎨)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Services
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubService())}
                        placeholder="Add a sub-service"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubService}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center"
                      >
                        <FiPlusCircle className="mr-1" /> Add
                      </button>
                    </div>
                    
                    {formData.subServices.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {formData.subServices.map((subService, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm text-gray-700">{subService}</span>
                            <button
                              type="button"
                              onClick={() => removeSubService(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingService(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FiSave className="mr-2" />
                      {editingService ? 'Update Service' : 'Add Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}