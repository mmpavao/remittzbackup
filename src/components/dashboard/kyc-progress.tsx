import { Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KYCProgressProps {
  status: 'pending' | 'in_progress' | 'completed';
  completionPercentage: number;
}

export function KYCProgress({ status, completionPercentage }: KYCProgressProps) {
  const handleStartVerification = () => {
    window.open('https://in.sumsub.com/websdk/p/sbx_TNeH9VqdtDMSYkUi', '_blank');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium">Account Verification</h3>
            <p className="text-sm text-gray-500">Complete your KYC verification</p>
          </div>
        </div>
        <Link
          to="/settings/kyc"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Verification Progress</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            status === 'completed' ? 'text-emerald-600' : 'text-gray-500'
          }`}>
            {status === 'pending' && 'Verification Required'}
            {status === 'in_progress' && 'Verification In Progress'}
            {status === 'completed' && 'Verification Completed'}
          </span>
          <button 
            onClick={handleStartVerification}
            disabled={status === 'completed'}
            className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}