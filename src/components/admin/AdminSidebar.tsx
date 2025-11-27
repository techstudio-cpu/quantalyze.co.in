'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/admin', icon: '🏠' },
  { title: 'Content', href: '/admin/content', icon: '📝' },
  { title: 'Services', href: '/admin/services', icon: '🛠️' },
  { title: 'Analytics', href: '/admin/analytics', icon: '📊' },
  { title: 'Newsletter', href: '/admin/newsletter', icon: '📧' },
  { title: 'Inquiries', href: '/admin/inquiries', icon: '💬' },
  { title: 'Team', href: '/admin/team', icon: '👥' },
  { title: 'Updates', href: '/admin/updates', icon: '🔄' },
  { title: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      {/* Logo Section */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">QUANTALYZE</h1>
            <p className="text-xs text-blue-100">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">admin@quantalyze.co.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
