'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardCard from '@/components/admin/DashboardCard';
import RevenueChart from '@/components/admin/RevenueChart';
import ProjectList from '@/components/admin/ProjectList';
import Notifications from '@/components/admin/Notifications';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 13,
    sales: 0,
    inquiries: 0,
    projects: 0,
    totalSubscribers: 0,
    newSubscribersToday: 0,
    activeTeamMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [announcement, setAnnouncement] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication (both localStorage and cookies)
    const token = localStorage.getItem('adminToken') || getCookie('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token validity
    try {
      const response = fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(data => {
        if (!data.success) {
          // Token is invalid, clear and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          deleteCookie('adminToken');
          router.push('/admin/login');
          return;
        }
        setUser(JSON.parse(userData || '{}'));
        fetchDashboardStats();
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      router.push('/admin/login');
    }
  }, [router]);

  // Helper function to get cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    deleteCookie('adminToken');
    router.push('/admin/login');
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch real statistics from various APIs
      const [subscribersRes, inquiriesRes, servicesRes, teamRes] = await Promise.all([
        fetch('/api/newsletter', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/inquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/team', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let stats = {
        services: 13, // Default from services.tsx
        sales: 0,
        inquiries: 0,
        projects: 0,
        totalSubscribers: 0,
        newSubscribersToday: 0,
        activeTeamMembers: 0
      };

      // Process subscribers data
      try {
        const subscribersData = await subscribersRes.json();
        if (subscribersData.success) {
          stats.totalSubscribers = subscribersData.count || 0;
          const today = new Date().toISOString().split('T')[0];
          const todaySubscribers = subscribersData.data.filter((sub: any) => 
            sub.created_at.startsWith(today)
          );
          stats.newSubscribersToday = todaySubscribers.length;
        }
      } catch (error) {
        console.log('Failed to fetch subscribers');
      }

      // Process inquiries data
      try {
        const inquiriesData = await inquiriesRes.json();
        if (inquiriesData.success) {
          stats.inquiries = inquiriesData.pagination?.total || inquiriesData.data?.length || 0;
        }
      } catch (error) {
        console.log('Failed to fetch inquiries');
      }

      // Process services data
      try {
        const servicesData = await servicesRes.json();
        if (servicesData.success) {
          stats.services = servicesData.data?.length || 13; // Fallback to 13
        }
      } catch (error) {
        console.log('Failed to fetch services, using default');
      }

      // Process team data
      try {
        const teamData = await teamRes.json();
        if (teamData.success) {
          stats.activeTeamMembers = teamData.data?.filter((member: any) => member.status === 'active').length || 0;
          stats.projects = teamData.data?.length || 0; // Use team count as projects proxy
        }
      } catch (error) {
        console.log('Failed to fetch team data');
      }

      // Calculate estimated sales (you can modify this based on your business logic)
      stats.sales = Math.round(stats.inquiries * 850); // Average $850 per inquiry
      
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (announcement.trim()) {
      try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch('/api/admin/updates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: 'Dashboard Announcement',
            content: announcement,
            type: 'announcement',
            priority: 'medium',
            status: 'published'
          })
        });

        if (response.ok) {
          setAnnouncement('');
          alert('Announcement posted successfully!');
        } else {
          alert('Failed to post announcement');
        }
      } catch (error) {
        console.error('Error posting announcement:', error);
        alert('Failed to post announcement');
      }
    }
  };

  const handleSyncAll = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Sync all data sources
      await Promise.all([
        fetch('/api/newsletter'), // Refresh subscribers
        fetch('/api/admin/inquiries', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/services', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/team', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/updates', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      // Refresh dashboard stats
      await fetchDashboardStats();
      alert('All data synchronized successfully!');
    } catch (error) {
      console.error('Error syncing data:', error);
      alert('Failed to sync some data');
    }
  };

  const handleExportAll = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch all data
      const [subscribersData, inquiriesData, servicesData, teamData, updatesData] = await Promise.all([
        fetch('/api/newsletter').then(res => res.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/inquiries', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/services', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/team', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/updates', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()).catch(() => ({ data: [] }))
      ]);

      const data = {
        subscribers: subscribersData,
        inquiries: inquiriesData,
        services: servicesData,
        team: teamData,
        updates: updatesData,
        exportDate: new Date().toISOString(),
        stats: stats
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantalyze_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const token = localStorage.getItem('adminToken');

      // Import subscribers
      if (data.subscribers?.data) {
        for (const subscriber of data.subscribers.data) {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: subscriber.email,
              name: subscriber.name,
              preferences: JSON.parse(subscriber.preferences || '[]')
            })
          });
        }
      }

      // Import other data types (inquiries, services, team, updates)
      // Note: This would require additional API endpoints or modifications

      await fetchDashboardStats();
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please check the file format.');
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleInitDatabase = async () => {
    try {
      const response = await fetch('/api/admin/init-db', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert('Database initialized successfully! Tables created and sample data added.');
        await fetchDashboardStats(); // Refresh stats
      } else {
        alert(`Database initialization failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Failed to initialize database');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {user.username || 'Admin'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSyncAll}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  🔄 Sync All
                </button>
                <button
                  onClick={handleExportAll}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  📤 Export
                </button>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer">
                  📥 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleInitDatabase}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700"
                >
                  🗄️ Init DB
                </button>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  View Website
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <DashboardCard
              title="Services"
              value={stats.services}
              icon="🛠️"
              color="bg-blue-500"
            />
            <DashboardCard
              title="Sales"
              value={`$${stats.sales.toLocaleString()}`}
              icon="💰"
              color="bg-green-500"
              trend={{
                value: stats.inquiries > 0 ? '+12%' : '0%',
                isPositive: stats.inquiries > 0,
                label: 'from inquiries'
              }}
            />
            <DashboardCard
              title="Inquiries"
              value={stats.inquiries}
              icon="💬"
              color="bg-purple-500"
              trend={{
                value: stats.newSubscribersToday > 0 ? `+${stats.newSubscribersToday}` : '0',
                isPositive: stats.newSubscribersToday > 0,
                label: 'new subscribers today'
              }}
            />
            <DashboardCard
              title="Team"
              value={stats.activeTeamMembers}
              icon="👥"
              color="bg-orange-500"
              trend={{
                value: `Total: ${stats.projects}`,
                isPositive: true,
                label: 'members & projects'
              }}
            />
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Newsletter Subscribers</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalSubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.inquiries > 0 ? Math.round((stats.sales / (stats.inquiries * 850)) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Avg. Revenue/Inquiry</h3>
                  <p className="text-2xl font-bold text-purple-600">$850</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart />
            <ProjectList />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Notifications />
            
            {/* Updates & Maintenance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates & Maintenance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add announcement
                  </label>
                  <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Enter announcement message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handlePostAnnouncement}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post Announcement
                </button>
              </div>
            </div>

            {/* Updates Card (Empty for now) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Updates</h3>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </a>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p>No recent updates</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
