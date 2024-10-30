import { PageHeader } from '@/components/ui/page-header';
import { Shield } from 'lucide-react';

export function KYC() {
  const handleStartVerification = () => {
    window.open('https://in.sumsub.com/websdk/p/sbx_TNeH9VqdtDMSYkUi', '_blank');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Verification"
        subtitle="Complete your identity verification to unlock all features"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'KYC' }
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Identity Verification</h2>
            <p className="text-sm text-gray-500">Complete verification to unlock all features</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Why verify your identity?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure secure transactions</li>
              <li>• Access higher transfer limits</li>
              <li>• Protect against fraud</li>
              <li>• Comply with regulations</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">What you'll need:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Valid government-issued ID</li>
              <li>• Clear photo of your face</li>
              <li>• Proof of address (if required)</li>
              <li>• A few minutes of your time</li>
            </ul>
          </div>

          <button
            onClick={handleStartVerification}
            className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Start Verification
          </button>

          <p className="text-sm text-gray-500 text-center">
            Your information is securely processed by our trusted partner Sumsub
          </p>
        </div>
      </div>
    </div>
  );
}