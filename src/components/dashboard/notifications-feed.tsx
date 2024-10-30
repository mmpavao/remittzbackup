import { Bell } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  avatar?: string;
  type?: string;
}

export function NotificationsFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Money Received',
      description: 'John sent you $500.00',
      time: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    {
      id: 2,
      title: 'Bill Payment',
      description: 'Electric bill due in 3 days',
      time: '2h ago',
      type: 'bill'
    }
  ]);

  const handleClearNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={handleClearNotifications}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              {notification.avatar ? (
                <img
                  src={notification.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
              )}
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
}