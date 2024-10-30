import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { SettingsLayout } from '@/layouts/settings-layout';

// Auth Pages
import { Login } from '@/pages/auth/login';
import { Signup } from '@/pages/auth/signup';

// Dashboard Pages
import { Dashboard } from '@/pages/dashboard';
import { Cards } from '@/pages/cards';
import { CardDetails } from '@/pages/cards/details';
import { Wallet } from '@/pages/wallet';
import { Transactions } from '@/pages/transactions';
import { SmartLinks } from '@/pages/smart-links';
import { Connections } from '@/pages/connections';

// Settings Pages
import { Profile } from '@/pages/settings/profile';
import { Security } from '@/pages/settings/security';
import { Notifications } from '@/pages/settings/notifications';
import { General } from '@/pages/settings/general';
import { Banking } from '@/pages/settings/banking';
import { KYC } from '@/pages/settings/kyc';

// Admin Pages
import { AdminAnalytics } from '@/pages/admin/analytics';
import { AdminTransactions } from '@/pages/admin/transactions';
import { AdminUsers } from '@/pages/admin/users';
import { AdminSecurity } from '@/pages/admin/security';
import { AdminApiKeys } from '@/pages/admin/api-keys';
import { AdminIntegrations } from '@/pages/admin/integrations';
import { PlatformSettings, PlatformSettingsIndex } from '@/pages/admin/platform';
import { PlatformGeneral } from '@/pages/admin/platform/general';
import { PlatformSEO } from '@/pages/admin/platform/seo';
import { AppMode } from '@/pages/admin/platform/app-mode';

// Payment Pages
import { PaymentCheckout } from '@/pages/payment/checkout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> }
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'cards', element: <Cards /> },
      { path: 'cards/:id', element: <CardDetails /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'smart-links', element: <SmartLinks /> },
      { path: 'connections', element: <Connections /> },
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'security', element: <Security /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'general', element: <General /> },
          { path: 'banking', element: <Banking /> },
          { path: 'kyc', element: <KYC /> }
        ]
      },
      {
        path: 'admin',
        children: [
          { path: 'analytics', element: <AdminAnalytics /> },
          { path: 'transactions', element: <AdminTransactions /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'security', element: <AdminSecurity /> },
          { path: 'api-keys', element: <AdminApiKeys /> },
          { path: 'integrations', element: <AdminIntegrations /> },
          {
            path: 'platform',
            element: <PlatformSettings />,
            children: [
              { path: '', element: <PlatformSettingsIndex /> },
              { path: 'general', element: <PlatformGeneral /> },
              { path: 'seo', element: <PlatformSEO /> },
              { path: 'app-mode', element: <AppMode /> }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'payment',
    children: [
      { path: 'checkout', element: <PaymentCheckout /> }
    ]
  }
];

export function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}