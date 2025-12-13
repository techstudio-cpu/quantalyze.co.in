'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Content {
  id: string;
  title: string;
  type: string;
  category: string;
  slug: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'blog',
    category: '',
    slug: '',
    body: '',
    status: 'draft'
  });
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
        fetchContent();
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

  const fetchContent = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/content' : `/api/content?type=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.content);
      } else {
        setError('Failed to fetch content');
      }
    } catch (error) {
      setError('Error fetching content');
    } finally {
      setLoading(false);
    }
  };

  const initializeContent = async () => {
    try {
      setIsInitializing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/admin/init-content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchContent();
      } else {
        setError('Failed to initialize content: ' + data.message);
      }
    } catch (error) {
      setError('Error initializing content');
    } finally {
      setIsInitializing(false);
    }
  };

  const toggleStatus = async (contentId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      const contentItem = content.find(c => c.id === contentId);
      
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: contentId,
          status: contentItem?.status === 'published' ? 'draft' : 'published'
        })
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      setError('Error updating content');
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`/api/content?id=${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchContent();
      } else {
        setError('Failed to delete content');
      }
    } catch (error) {
      setError('Error deleting content');
    }
  };

  const createContent = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          title: '',
          type: 'blog',
          category: '',
          slug: '',
          body: '',
          status: 'draft'
        });
        fetchContent();
      } else {
        setError('Failed to create content');
      }
    } catch (error) {
      setError('Error creating content');
    }
  };

  const updateContent = async () => {
    if (!editingContent) return;
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingContent.id,
          ...formData
        })
      });

      if (response.ok) {
        setEditingContent(null);
        setFormData({
          title: '',
          type: 'blog',
          category: '',
          slug: '',
          body: '',
          status: 'draft'
        });
        fetchContent();
      } else {
        setError('Failed to update content');
      }
    } catch (error) {
      setError('Error updating content');
    }
  };

  const startEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    setFormData({
      title: contentItem.title,
      type: contentItem.type,
      category: contentItem.category,
      slug: contentItem.slug,
      body: '', // This would need to be fetched separately if needed
      status: contentItem.status
    });
  };

  const cancelEdit = () => {
    setEditingContent(null);
    setFormData({
      title: '',
      type: 'blog',
      category: '',
      slug: '',
      body: '',
      status: 'draft'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-blue-100 text-blue-800';
      case 'page': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'case_study': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <span className="text-gray-600">Content Management</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Management</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Manage your blog posts, pages, tutorials, and case studies
            </p>
            <button
              onClick={initializeContent}
              disabled={isInitializing}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Content'}
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
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        ) : content.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500 mb-4">
              Get started by initializing the content data
            </p>
            <button
              onClick={initializeContent}
              disabled={isInitializing}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Content'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Content Items</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Create Content
                  </button>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="blog">Blog Posts</option>
                    <option value="page">Pages</option>
                    <option value="tutorial">Tutorials</option>
                    <option value="case_study">Case Studies</option>
                  </select>
                  <button
                    onClick={fetchContent}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((contentItem) => (
                    <tr key={contentItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contentItem.title}</div>
                          <div className="text-sm text-gray-500">/{contentItem.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(contentItem.type)}`}>
                          {contentItem.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contentItem.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contentItem.status)}`}>
                          {contentItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contentItem.published_at ? new Date(contentItem.published_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleStatus(contentItem.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              contentItem.status === 'published'
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            } transition-colors`}
                          >
                            {contentItem.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => startEdit(contentItem)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteContent(contentItem.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {content.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No content found for this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Create/Edit Content Modal */}
        {(showCreateForm || editingContent) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="page">Page</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="case_study">Case Study</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Body Content</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({...formData, body: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 p-2 border"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingContent(null);
                    cancelEdit();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingContent ? updateContent : createContent}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
                >
                  {editingContent ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
