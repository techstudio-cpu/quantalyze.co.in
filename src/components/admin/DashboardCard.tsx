import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  children?: ReactNode;
}

export default function DashboardCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend,
  children 
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
          </div>
        )}
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
