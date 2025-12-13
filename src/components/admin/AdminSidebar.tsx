'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
  exact?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/admin', icon: '🏠', exact: true },
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
  const router = useRouter();

  const isActive = (item: SidebarItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const handleLogout = () => {
    // Clear client-side authentication
    if (typeof window !== "undefined") {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    
    // Redirect to login
    router.push('/admin/login');
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen sticky top-0">
        <div className="flex flex-col h-full border-r border-gray-200 bg-white">
          {/* Logo Section */}
          <div className="pt-5 pb-4 px-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">QUANTALYZE</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="px-2 space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive(item)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User Section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">👤</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs font-medium text-gray-500">
                  admin@quantalyze.co.in
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Sign out"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
