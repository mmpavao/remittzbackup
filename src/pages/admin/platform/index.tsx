import { Navigate, Outlet } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { PlatformSettingsNav } from '@/components/ui/platform-settings-nav';

export function PlatformSettings() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings"
        subtitle="Configure global platform settings and preferences"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Platform Settings' }
        ]}
      />

      <div className="space-y-8">
        <PlatformSettingsNav />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function PlatformSettingsIndex() {
  return <Navigate to="/admin/platform/general" replace />;
}