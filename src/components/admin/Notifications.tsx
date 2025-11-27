interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'inquiry' | 'update' | 'warning';
  time: string;
}

const notifications: Notification[] = [
  { id: 1, title: 'New Inquiry Alert', description: '3 new contact form submissions', type: 'inquiry', time: '2 hours ago' },
  { id: 2, title: 'Pending Updates', description: '5 content updates awaiting approval', type: 'update', time: '4 hours ago' },
  { id: 3, title: 'System Warning', description: 'Storage usage at 85% capacity', type: 'warning', time: '1 day ago' },
];

const notificationIcons = {
  inquiry: '📬',
  update: '🔄',
  warning: '⚠️',
};

const notificationColors = {
  inquiry: 'bg-orange-100 text-orange-600',
  update: 'bg-orange-100 text-orange-600',
  warning: 'bg-red-100 text-red-600',
};

export default function Notifications() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notificationColors[notification.type]}`}>
              <span className="text-sm">{notificationIcons[notification.type]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
              <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
