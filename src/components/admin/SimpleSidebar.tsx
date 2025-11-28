'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Settings, Mail, BarChart, Users, Bell } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Inquiries', href: '/admin/inquiries', icon: Bell },
  { name: 'Team', href: '/admin/team', icon: Users },
  { name: 'Updates', href: '/admin/updates', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function SimpleSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Quantalyze</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@quantalyze.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
