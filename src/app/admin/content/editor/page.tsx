'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContentItem {
  id: number;
  section: string;
  component: string;
  field_name: string;
  field_value: string;
  field_type: string;
  updated_at: string;
}

interface Section {
  id: number;
  section_id: string;
  section_name: string;
  section_order: number;
  is_visible: boolean;
}

export default function ContentEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [content, setContent] = useState<Record<string, ContentItem[]>>({});
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();

  // Helper functions for authentication
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken') || getCookie('adminToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token and fetch content
    fetch('/api/admin/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      if (!data.success) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        deleteCookie('adminToken');
        router.push('/admin/login');
        return;
      }
      fetchContent();
    }).catch(error => {
      console.error('Token verification failed:', error);
      router.push('/admin/login');
    });
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      
      if (data.success) {
        setSections(data.data.sections);
        setContent(data.data.content);
        
        // Initialize editing content
        const initialEditingContent: Record<string, string> = {};
        Object.entries(data.data.content).forEach(([section, items]: [string, any]) => {
          items.forEach((item: ContentItem) => {
            initialEditingContent[`${item.section}-${item.component}-${item.field_name}`] = item.field_value;
          });
        });
        setEditingContent(initialEditingContent);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setNotification({ type: 'error', message: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const initializeContent = async () => {
    try {
      const response = await fetch('/api/admin/content/init/', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setNotification({ type: 'success', message: 'Content initialized successfully!' });
        fetchContent(); // Refresh content
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to initialize content' });
      }
    } catch (error) {
      console.error('Failed to initialize content:', error);
      setNotification({ type: 'error', message: 'Failed to initialize content' });
    }
  };

  const saveContent = async (section: string, component: string, fieldName: string, value: string) => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          component,
          fieldName,
          fieldValue: value,
          fieldType: 'text'
        }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  };

  const handleFieldChange = (section: string, component: string, fieldName: string, value: string) => {
    const key = `${section}-${component}-${fieldName}`;
    setEditingContent(prev => ({ ...prev, [key]: value }));
  };

  const saveAllChanges = async () => {
    setSaving(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      for (const [key, value] of Object.entries(editingContent)) {
        const [section, component, fieldName] = key.split('-');
        const success = await saveContent(section, component, fieldName, value);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      if (failCount === 0) {
        setNotification({ type: 'success', message: `All ${successCount} changes saved successfully!` });
      } else {
        setNotification({ type: 'error', message: `${successCount} saved, ${failCount} failed` });
      }
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setNotification({ type: 'error', message: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (item: ContentItem) => {
    const key = `${item.section}-${item.component}-${item.field_name}`;
    const value = editingContent[key] || '';
    
    switch (item.field_type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(item.section, item.component, item.field_name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder={`Enter ${item.field_name}...`}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(item.section, item.component, item.field_name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${item.field_name}...`}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(item.section, item.component, item.field_name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${item.field_name}...`}
          />
        );
    }
  };

  const renderPreview = () => {
    const sectionContent = content[selectedSection] || [];
    const heroContent = sectionContent.reduce((acc: any, item) => {
      acc[item.field_name] = editingContent[`${item.section}-${item.component}-${item.field_name}`] || item.field_value;
      return acc;
    }, {});

    if (selectedSection === 'hero') {
      return (
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-yellow-700 shadow-lg">
              <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500" />
              {heroContent.badge || 'Badge text'}
            </div>
            <h1 className="mt-6 text-4xl font-bold text-gray-900">
              {heroContent.title || 'Title text'}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {heroContent.subtitle || 'Subtitle text'}
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold">
                {heroContent.primaryButton || 'Primary Button'}
              </button>
              <button className="border border-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold">
                {heroContent.secondaryButton || 'Secondary Button'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 p-8 rounded-lg">
        <p className="text-gray-500">Preview not available for this section</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content editor...</p>
        </div>
      </div>
    );
  }

  const currentSectionContent = content[selectedSection] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/content" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Back to Content Management
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Visual Content Editor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  previewMode 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {previewMode ? '👁️ Exit Preview' : '👁️ Preview Mode'}
              </button>
              <button
                onClick={saveAllChanges}
                disabled={saving}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save All Changes'}
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                View Website
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Initialize Content Button */}
        {sections.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No Content Found</h3>
            <p className="text-yellow-600 mb-4">Initialize the website content to start editing.</p>
            <button
              onClick={initializeContent}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600"
            >
              Initialize Content
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Sections</h3>
              </div>
              <div className="p-4">
                {sections.map((section) => (
                  <button
                    key={section.section_id}
                    onClick={() => setSelectedSection(section.section_id)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      selectedSection === section.section_id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.section_name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="lg:col-span-3">
            {previewMode ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Preview: {sections.find(s => s.section_id === selectedSection)?.section_name}</h3>
                </div>
                <div className="p-6">
                  {renderPreview()}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Edit: {sections.find(s => s.section_id === selectedSection)?.section_name}</h3>
                </div>
                <div className="p-6">
                  {currentSectionContent.length === 0 ? (
                    <p className="text-gray-500">No content found for this section.</p>
                  ) : (
                    <div className="space-y-6">
                      {currentSectionContent.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {item.field_name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          {renderField(item)}
                          <p className="mt-2 text-xs text-gray-500">
                            Component: {item.component} | Type: {item.field_type}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
