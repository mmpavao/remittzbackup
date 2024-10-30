import { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { getWalletTransactions } from '@/lib/wallet';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  timestamp: { toDate: () => Date };
  status: 'completed' | 'pending' | 'failed';
}

interface WalletTransactionsProps {
  wallet: {
    id: string;
    country: string;
    currency: string;
  };
  onClose: () => void;
}

export function WalletTransactions({ wallet, onClose }: WalletTransactionsProps) {
  const { userData } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userData?.uid) return;

      try {
        setLoading(true);
        const data = await getWalletTransactions(wallet.id, userData.uid);
        setTransactions(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [wallet.id, userData?.uid]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency,
    }).format(amount);
  };

  const capitalizeStatus = (status: string | undefined) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{wallet.country} Wallet Transactions</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      {
                        'bg-emerald-100': transaction.type === 'deposit',
                        'bg-red-100': transaction.type === 'withdrawal',
                        'bg-blue-100': transaction.type === 'transfer'
                      }
                    )}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className={cn(
                          "w-5 h-5",
                          {
                            'text-emerald-600': transaction.type === 'deposit',
                            'text-red-600': transaction.type === 'withdrawal',
                            'text-blue-600': transaction.type === 'transfer'
                          }
                        )} />
                      ) : (
                        <ArrowUpRight className={cn(
                          "w-5 h-5",
                          {
                            'text-emerald-600': transaction.type === 'deposit',
                            'text-red-600': transaction.type === 'withdrawal',
                            'text-blue-600': transaction.type === 'transfer'
                          }
                        )} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || 'Untitled Transaction'}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.timestamp?.toDate().toLocaleDateString() || 'No date'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-medium",
                      {
                        'text-emerald-600': transaction.type === 'deposit',
                        'text-red-600': transaction.type === 'withdrawal',
                        'text-blue-600': transaction.type === 'transfer'
                      }
                    )}>
                      {transaction.type === 'deposit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.status && (
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs rounded-full",
                        {
                          'bg-emerald-100 text-emerald-700': transaction.status === 'completed',
                          'bg-yellow-100 text-yellow-700': transaction.status === 'pending',
                          'bg-red-100 text-red-700': transaction.status === 'failed'
                        }
                      )}>
                        {capitalizeStatus(transaction.status)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}