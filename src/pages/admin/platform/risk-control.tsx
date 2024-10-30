import { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, AlertTriangle, 
  ArrowUpRight, ArrowDownLeft, RefreshCw,
  Download, PieChart, TrendingUp, DollarSign,
  Shield, AlertOctagon, CheckCircle2
} from 'lucide-react';
import { DateRangePicker } from '@/components/transactions/date-range-picker';
import { TransactionFlow } from '@/components/admin/risk/transaction-flow';
import { RiskMetrics } from '@/components/admin/risk/risk-metrics';
import { AccountReconciliation } from '@/components/admin/risk/account-reconciliation';
import { RiskScoreCard } from '@/components/admin/risk/risk-score-card';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  riskScore: number;
  flags?: string[];
}

interface RiskMetric {
  totalTransactions: number;
  totalVolume: number;
  avgTransactionSize: number;
  riskScore: number;
  flaggedTransactions: number;
  suspiciousUsers: number;
}

export function RiskControl() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<RiskMetric | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [view, setView] = useState<'transactions' | 'reconciliation' | 'flow'>('transactions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchMetrics();
  }, [dateRange]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const mockTransactions: Transaction[] = [
        {
          id: 'tx_1',
          type: 'transfer',
          amount: 5000,
          currency: 'USD',
          fromUserId: 'user_1',
          fromUserName: 'Marcos Silva',
          toUserId: 'user_2',
          toUserName: 'João Santos',
          timestamp: '2024-03-15T09:30:00',
          status: 'completed',
          riskScore: 65,
          flags: ['large_amount', 'frequent_transfers']
        },
        {
          id: 'tx_2',
          type: 'transfer',
          amount: 3000,
          currency: 'USD',
          fromUserId: 'user_1',
          fromUserName: 'Marcos Silva',
          toUserId: 'user_2',
          toUserName: 'João Santos',
          timestamp: '2024-03-15T14:45:00',
          status: 'completed',
          riskScore: 85,
          flags: ['multiple_transfers_same_day']
        },
        {
          id: 'tx_3',
          type: 'withdrawal',
          amount: 4000,
          currency: 'USD',
          fromUserId: 'user_2',
          fromUserName: 'João Santos',
          toUserId: 'bank_1',
          toUserName: 'Bank Withdrawal',
          timestamp: '2024-03-15T16:20:00',
          status: 'completed',
          riskScore: 70,
          flags: ['large_withdrawal']
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // In a real app, this would be an API call
      const mockMetrics: RiskMetric = {
        totalTransactions: 1250,
        totalVolume: 750000,
        avgTransactionSize: 600,
        riskScore: 42,
        flaggedTransactions: 15,
        suspiciousUsers: 3
      };

      setMetrics(mockMetrics);
    } catch (error) {
      toast.error('Failed to fetch risk metrics');
    }
  };

  const handleExport = () => {
    // Implement CSV export
    toast.success('Report exported successfully');
  };

  const handleReconciliation = async () => {
    // Implement balance reconciliation
    toast.success('Account reconciliation completed');
  };

  const handleFlagTransaction = async (transactionId: string) => {
    // Implement transaction flagging
    toast.success('Transaction flagged for review');
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskScoreCard
          title="Platform Risk Score"
          value={metrics?.riskScore || 0}
          icon={Shield}
          trend="down"
          trendValue={5}
        />
        <RiskScoreCard
          title="Flagged Transactions"
          value={metrics?.flaggedTransactions || 0}
          icon={AlertOctagon}
          trend="up"
          trendValue={2}
          format="number"
        />
        <RiskScoreCard
          title="Transaction Volume"
          value={metrics?.totalVolume || 0}
          icon={TrendingUp}
          trend="up"
          trendValue={12}
          format="currency"
        />
        <RiskScoreCard
          title="Suspicious Users"
          value={metrics?.suspiciousUsers || 0}
          icon={AlertTriangle}
          trend="up"
          trendValue={1}
          format="number"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions, users, or IDs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        >
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date Range</span>
          </button>
        </DateRangePicker>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('transactions')}
            className={cn(
              "px-3 py-2 rounded-lg",
              view === 'transactions'
                ? "bg-emerald-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            )}
          >
            Transactions
          </button>
          <button
            onClick={() => setView('flow')}
            className={cn(
              "px-3 py-2 rounded-lg",
              view === 'flow'
                ? "bg-emerald-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            )}
          >
            Flow Analysis
          </button>
          <button
            onClick={() => setView('reconciliation')}
            className={cn(
              "px-3 py-2 rounded-lg",
              view === 'reconciliation'
                ? "bg-emerald-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            )}
          >
            Reconciliation
          </button>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {view === 'transactions' && (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors cursor-pointer",
                  transaction.riskScore > riskThreshold
                    ? "border-red-200 bg-red-50 hover:bg-red-100"
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      {
                        'bg-emerald-100': transaction.type === 'deposit',
                        'bg-red-100': transaction.type === 'withdrawal',
                        'bg-blue-100': transaction.type === 'transfer'
                      }
                    )}>
                      {transaction.type === 'transfer' ? (
                        <RefreshCw className="w-5 h-5 text-blue-600" />
                      ) : transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {transaction.fromUserName} → {transaction.toUserName}
                        </p>
                        {transaction.riskScore > riskThreshold && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: transaction.currency
                      }).format(transaction.amount)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        {
                          'bg-emerald-100 text-emerald-800': transaction.status === 'completed',
                          'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                          'bg-red-100 text-red-800': transaction.status === 'failed',
                          'bg-orange-100 text-orange-800': transaction.status === 'flagged'
                        }
                      )}>
                        {transaction.status}
                      </span>
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        transaction.riskScore > riskThreshold
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      )}>
                        Risk: {transaction.riskScore}
                      </span>
                    </div>
                  </div>
                </div>

                {transaction.flags && transaction.flags.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {transaction.flags.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {view === 'flow' && (
          <TransactionFlow
            transactions={transactions}
            onNodeClick={(userId) => {
              // Handle user node click
              console.log('User clicked:', userId);
            }}
          />
        )}

        {view === 'reconciliation' && (
          <AccountReconciliation
            transactions={transactions}
            onReconcile={handleReconciliation}
          />
        )}
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMetrics
          metrics={metrics}
          transactions={transactions}
        />
      </div>
    </div>
  );
}