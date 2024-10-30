import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CardSection } from '@/components/dashboard/card-section';
import { MonthlyPayments } from '@/components/dashboard/monthly-payments';
import { StatisticsChart } from '@/components/dashboard/statistics-chart';
import { WalletBalances } from '@/components/dashboard/wallet-balances';
import { KYCProgress } from '@/components/dashboard/kyc-progress';

const mockChartData = [
  { value: 40, date: '3 July' },
  { value: 30, date: '4 July' },
  { value: 45, date: '5 July' },
  { value: 25, date: '6 July' },
  { value: 55, date: '7 July' },
  { value: 40, date: '8 July' },
  { value: 45, date: '9 July' }
];

const mockWallets = [
  {
    id: '1',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    balance: 32819.00,
    isPrimary: true
  },
  {
    id: '2',
    country: 'Brazil',
    countryCode: 'BR',
    currency: 'BRL',
    balance: 3750.00,
    isPrimary: false
  },
  {
    id: '3',
    country: 'European Union',
    countryCode: 'EU',
    currency: 'EUR',
    balance: 4500.00,
    isPrimary: false
  }
];

export function Dashboard() {
  const { userData } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'earning' | 'spending'>('earning');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-gray-500">Good morning {userData?.fullName} 👋</p>
      </div>

      {/* KYC Progress */}
      <KYCProgress 
        status={userData?.kycStatus || 'pending'} 
        completionPercentage={userData?.kycCompletionPercentage || 0} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Earnings"
          amount="$21,500.00"
          percentage={12}
          trend="up"
          data={mockChartData}
        />
        <StatsCard
          title="Total Spending"
          amount="$5,392.00"
          percentage={8}
          trend="down"
          data={mockChartData}
        />
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('earning')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === 'earning'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Earning
            </button>
            <button
              onClick={() => setActiveTab('spending')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === 'spending'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Spending
            </button>
          </div>
        </div>
        <StatisticsChart data={mockChartData} type={activeTab} />
      </div>

      {/* Additional Wallets */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Other Wallets</h2>
        </div>
        <WalletBalances 
          wallets={mockWallets.filter(w => !w.isPrimary)} 
          compact={false} 
        />
      </div>

      {/* Card Section */}
      <CardSection />

      {/* Monthly Payments */}
      <MonthlyPayments />
    </div>
  );
}