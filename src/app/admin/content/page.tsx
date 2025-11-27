'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export default function ContentManagement() {
  const [sections, setSections] = useState<ContentSection[]>([
    {
      id: 'hero',
      title: 'Hero Section',
      content: 'Transform your digital presence with Quantalyze\'s AI-powered marketing solutions.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'about',
      title: 'About Us',
      content: 'We are a remote digital agency serving clients worldwide with cutting-edge marketing strategies.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'services',
      title: 'Services Overview',
      content: 'From social media marketing to AI automation, we offer comprehensive digital solutions.',
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (sectionId: string) => {
    try {
      // Here you would save to your database/API
      setSections(sections.map(section => 
        section.id === sectionId 
          ? { ...section, content: editContent, lastUpdated: new Date().toISOString() }
          : section
      ));
      setNotification({ type: 'success', message: 'Content saved successfully!' });
      setTimeout(() => setNotification(null), 3000);
      setEditingSection(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to save content:', error);
      setNotification({ type: 'error', message: 'Failed to save content. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage website content and pages</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  View Website
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/admin/content/editor" 
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
              >
                🎨 Visual Editor
              </Link>
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
                🔄 Sync All
              </button>
              <button className="bg-orange-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors">
                📤 Export
              </button>
              <button className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
                📥 Import
              </button>
            </div>
          </div>

          {/* Website Sections Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Hero Section</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Main landing section with headlines and CTAs</p>
                <Link href="/admin/content/editor?section=hero" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit Hero →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Services</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Service offerings and descriptions</p>
                <Link href="/admin/content/editor?section=services" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit Services →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Navigation</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Menu items and navigation links</p>
                <Link href="/admin/content/editor?section=navbar" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit Navigation →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Contact</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Contact information and form</p>
                <Link href="/admin/content/editor?section=contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit Contact →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Footer</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Footer links and company info</p>
                <Link href="/admin/content/editor?section=footer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit Footer →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">About Us</h4>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Company story and team information</p>
                <button className="text-gray-400 text-sm font-medium cursor-not-allowed">
                  Coming Soon →
                </button>
              </div>
            </div>
          </div>

          {/* Content Sections List */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        Last updated: {new Date(section.lastUpdated).toLocaleDateString()}
                      </span>
                      {editingSection !== section.id ? (
                        <button
                          onClick={() => handleEdit(section)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(section.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {editingSection === section.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Enter content..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
