import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const settingsMenu = [
  {
    label: 'General',
    path: '/settings/general',
    description: 'Basic settings'
  },
  {
    label: 'Profile',
    path: '/settings/profile',
    description: 'Manage your personal information'
  },
  {
    label: 'Security',
    path: '/settings/security',
    description: 'Secure your account'
  },
  {
    label: 'KYC',
    path: '/settings/kyc',
    description: 'Identity verification'
  },
  {
    label: 'Banking',
    path: '/settings/banking',
    description: 'Manage your banking information'
  },
  {
    label: 'Notifications',
    path: '/settings/notifications',
    description: 'Configure your notification preferences'
  }
];

export function SettingsNav() {
  const location = useLocation();

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {settingsMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              location.pathname === item.path
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}