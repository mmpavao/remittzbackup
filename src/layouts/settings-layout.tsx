import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { SettingsNav } from '@/components/ui/settings-nav';

export function SettingsLayout() {
  const location = useLocation();

  // Redirect to profile page if directly accessing /settings
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        <SettingsNav />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}