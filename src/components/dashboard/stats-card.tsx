import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  amount: string;
  percentage: number;
  trend: 'up' | 'down';
  data: Array<{ value: number }>;
}

export function StatsCard({ title, amount, percentage, trend, data }: StatsCardProps) {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-500">{title}</p>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
            isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="font-medium">{percentage}%</span>
          </div>
        </div>
        <h3 className="text-2xl font-semibold">{amount}</h3>
      </div>
      
      <div className="h-[60px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}