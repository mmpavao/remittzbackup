import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const platformSettingsMenu = [
  {
    label: 'General',
    path: '/admin/platform/general',
    description: 'Basic platform configuration'
  },
  {
    label: 'SEO',
    path: '/admin/platform/seo',
    description: 'Search engine optimization settings'
  },
  {
    label: 'APP Mode',
    path: '/admin/platform/app-mode',
    description: 'Configure production settings'
  }
];

export function PlatformSettingsNav() {
  const location = useLocation();

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {platformSettingsMenu.map((item) => (
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