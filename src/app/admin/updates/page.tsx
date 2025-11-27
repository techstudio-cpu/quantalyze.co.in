'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Update {
  id: number;
  title: string;
  content: string;
  type: 'announcement' | 'maintenance' | 'feature' | 'bugfix';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement' as 'announcement' | 'maintenance' | 'feature' | 'bugfix',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchUpdates();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken') || getCookie('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/updates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUpdates(data.data || []);
      } else {
        // Fallback to static data if API doesn't exist yet
        const staticUpdates = [
          {
            id: 1,
            title: 'Website Launch',
            content: 'Quantalyze digital agency website has been successfully launched with all core features.',
            type: 'announcement' as const,
            priority: 'high' as const,
            status: 'published' as const,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            published_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            title: 'Admin Panel Enhancement',
            content: 'New admin panel features added including real-time analytics and team management.',
            type: 'feature' as const,
            priority: 'medium' as const,
            status: 'published' as const,
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z',
            published_at: '2024-01-15T00:00:00Z'
          }
        ];
        setUpdates(staticUpdates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (update: Update) => {
    setSelectedUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      priority: update.priority,
      status: update.status
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/updates', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchUpdates();
        setSelectedUpdate(null);
        setIsEditing(false);
      } else {
        alert('Failed to delete update');
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Failed to delete update');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && selectedUpdate ? '/api/admin/updates' : '/api/admin/updates';
      const method = isEditing && selectedUpdate ? 'PATCH' : 'POST';
      
      const payload = isEditing && selectedUpdate 
        ? { id: selectedUpdate.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchUpdates();
        setSelectedUpdate(null);
        setIsEditing(false);
        setFormData({
          title: '',
          content: '',
          type: 'announcement',
          priority: 'medium',
          status: 'draft'
        });
      } else {
        alert('Failed to save update');
      }
    } catch (error) {
      console.error('Error saving update:', error);
      alert('Failed to save update');
    }
  };

  const publishUpdate = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/updates', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: 'published' })
      });

      if (response.ok) {
        fetchUpdates();
      } else {
        alert('Failed to publish update');
      }
    } catch (error) {
      console.error('Error publishing update:', error);
      alert('Failed to publish update');
    }
  };

  const exportUpdates = () => {
    const csvContent = [
      ['Title', 'Type', 'Priority', 'Status', 'Created', 'Published'],
      ...updates.map(update => [
        update.title,
        update.type,
        update.priority,
        update.status,
        new Date(update.created_at).toLocaleDateString(),
        update.published_at ? new Date(update.published_at).toLocaleDateString() : 'Not published'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `updates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'bugfix': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'maintenance': return '🔧';
      case 'feature': return '✨';
      case 'bugfix': return '🐛';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Updates</h1>
                <p className="text-sm text-gray-600 mt-1">Manage announcements and system updates</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSelectedUpdate(null);
                    setIsEditing(false);
                    setFormData({
                      title: '',
                      content: '',
                      type: 'announcement',
                      priority: 'medium',
                      status: 'draft'
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  ➕ Add Update
                </button>
                <button
                  onClick={exportUpdates}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  📤 Export CSV
                </button>
                <button
                  onClick={fetchUpdates}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading updates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchUpdates}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Updates List */}
              <div className="space-y-4 mb-6">
                {updates.map((update) => (
                  <div key={update.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getTypeIcon(update.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(update.type)}`}>
                              {update.type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(update.priority)}`}>
                              {update.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(update.status)}`}>
                              {update.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {update.status === 'draft' && (
                          <button
                            onClick={() => publishUpdate(update.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(update)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(update.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{update.content}</p>
                    
                    <div className="text-xs text-gray-500">
                      <span>Created: {new Date(update.created_at).toLocaleDateString()}</span>
                      {update.published_at && (
                        <span className="ml-4">Published: {new Date(update.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Update Modal */}
              {(isEditing || !selectedUpdate) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Edit Update' : 'Add New Update'}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedUpdate(null);
                          setIsEditing(false);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="announcement">Announcement</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="feature">Feature</option>
                            <option value="bugfix">Bug Fix</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUpdate(null);
                            setIsEditing(false);
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          {isEditing ? 'Update' : 'Create'} Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
