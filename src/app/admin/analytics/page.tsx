'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

type DailyPoint = {
  date: string;
  count: number;
};

type AnalyticsState = {
  subscribers: {
    total: number;
    growth: number;
    daily: DailyPoint[];
  };
  traffic: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
  performance: {
    loadTime: number;
    uptime: number;
  };
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    subscribers: {
      total: 0,
      growth: 0,
      daily: [] as DailyPoint[],
    },
    traffic: {
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
    },
    performance: {
      loadTime: 0,
      uptime: 0,
    },
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchAnalytics();
  }, [timeRange]);

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

  const fetchAnalytics = async () => {
    try {
      // Fetch subscriber data
      const subscribersRes = await fetch('/api/newsletter');
      const subscribersData = await subscribersRes.json();
      
      if (subscribersData.success) {
        // Generate mock analytics data
        const dailyData = generateDailyData(subscribersData.data, timeRange);
        
        setAnalytics({
          subscribers: {
            total: subscribersData.count,
            growth: calculateGrowth(subscribersData.data, timeRange),
            daily: dailyData
          },
          traffic: {
            pageViews: Math.floor(Math.random() * 5000) + 1000,
            uniqueVisitors: Math.floor(Math.random() * 2000) + 500,
            bounceRate: Math.floor(Math.random() * 30) + 20
          },
          performance: {
            loadTime: Math.floor(Math.random() * 1000) + 500,
            uptime: Math.floor(Math.random() * 5) + 95
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const generateDailyData = (subscribers: any[], range: '7d' | '30d' | '90d'): DailyPoint[] => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data: DailyPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = subscribers.filter(s => s.created_at.startsWith(dateStr)).length;
      data.push({
        date: dateStr,
        count: count
      });
    }
    
    return data;
  };

  const calculateGrowth = (subscribers: any[], range: '7d' | '30d' | '90d') => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentSubscribers = subscribers.filter(s => new Date(s.created_at) > cutoffDate);
    const previousSubscribers = subscribers.filter(s => new Date(s.created_at) <= cutoffDate);
    
    if (previousSubscribers.length === 0) return 100;
    return Math.round((recentSubscribers.length / previousSubscribers.length) * 100);
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-600 mt-1">Website performance and user metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) =>
                    setTimeRange(e.target.value as '7d' | '30d' | '90d')
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <button
                  onClick={fetchAnalytics}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📧</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Subscribers
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {analytics.subscribers.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`${analytics.subscribers.growth > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {analytics.subscribers.growth > 0 ? '+' : ''}{analytics.subscribers.growth}%
                </span>
                <span className="text-gray-500"> growth</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">👁️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Page Views
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {analytics.traffic.pageViews.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  {analytics.traffic.uniqueVisitors.toLocaleString()}
                </span>
                <span className="text-gray-500"> unique visitors</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Bounce Rate
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {analytics.traffic.bounceRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`${analytics.traffic.bounceRate < 50 ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                  {analytics.traffic.bounceRate < 50 ? 'Good' : 'Average'}
                </span>
                <span className="text-gray-500"> performance</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Load Time
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {analytics.performance.loadTime}ms
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`${analytics.performance.loadTime < 1000 ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                  {analytics.performance.loadTime < 1000 ? 'Fast' : 'Slow'}
                </span>
                <span className="text-gray-500"> loading</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subscriber Growth Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subscriber Growth</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.subscribers.daily.slice(-7).map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${Math.max(day.count * 20, 10)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Server Uptime</span>
                  <span className="text-sm text-gray-500">{analytics.performance.uptime}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analytics.performance.uptime}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Page Speed</span>
                  <span className="text-sm text-gray-500">{analytics.performance.loadTime}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${analytics.performance.loadTime < 1000 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(analytics.performance.loadTime / 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">User Engagement</span>
                  <span className="text-sm text-gray-500">{100 - analytics.traffic.bounceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${100 - analytics.traffic.bounceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  New subscriber: tech.studio.st@gmail.com
                </span>
                <span className="text-xs text-gray-400">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Content updated: Hero section
                </span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Analytics report generated
                </span>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
