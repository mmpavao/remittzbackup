import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { DateRangePicker } from '@/components/transactions/date-range-picker';

const mockData = {
  transactions: [
    { date: '2024-03-01', value: 5000 },
    { date: '2024-03-02', value: 7500 },
    { date: '2024-03-03', value: 6000 },
    { date: '2024-03-04', value: 8000 },
    { date: '2024-03-05', value: 9500 },
    { date: '2024-03-06', value: 11000 },
    { date: '2024-03-07', value: 10000 }
  ],
  paymentMethods: [
    { name: 'Credit Card', value: 45 },
    { name: 'Bank Transfer', value: 30 },
    { name: 'PIX', value: 15 },
    { name: 'Boleto', value: 10 }
  ],
  stats: {
    totalTransactions: 1234,
    totalVolume: 125000,
    averageTransaction: 101.30,
    successRate: 98.5
  }
};

export function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Monitor your platform's performance and trends"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Analytics' }
        ]}
      />

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        >
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Filter by Date</span>
          </button>
        </DateRangePicker>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="text-2xl font-semibold mt-2">
            {mockData.stats.totalTransactions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
          <p className="text-2xl font-semibold mt-2">
            ${mockData.stats.totalVolume.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Average Transaction</h3>
          <p className="text-2xl font-semibold mt-2">
            ${mockData.stats.averageTransaction.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-2xl font-semibold mt-2">
            {mockData.stats.successRate}%
          </p>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-6">Transaction Volume</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.transactions}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`$${value}`, 'Volume']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-6">Payment Methods Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.paymentMethods}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Usage']}
              />
              <Bar
                dataKey="value"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}