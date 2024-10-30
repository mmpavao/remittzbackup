import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useWallets } from '@/hooks/use-wallets';
import { cn } from '@/lib/utils';

interface DepositFormProps {
  wallet: {
    id: string;
    country: string;
    currency: string;
    balance: number;
  };
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export function DepositForm({ wallet, onClose, onSuccess }: DepositFormProps) {
  const { userData } = useAuthStore();
  const { handleTransaction } = useWallets();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency,
    }).format(Number(number) / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    if (!userData?.uid) {
      setError('You must be logged in');
      return;
    }

    const depositAmount = Number(amount) / 100;

    setLoading(true);
    try {
      const updatedWallet = await handleTransaction(wallet.id, 'deposit', depositAmount, 'Manual deposit');
      
      // Verify the transaction was successful by checking the new balance
      if (updatedWallet.balance !== wallet.balance + depositAmount) {
        console.warn('Balance verification failed, please check your balance');
      }
      
      onSuccess(depositAmount);
    } catch (error: any) {
      console.error('Deposit failed:', error);
      setError(error.message || 'Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Deposit to {wallet.country} Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount ? formatCurrency(amount) : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setAmount(value);
                  }}
                  placeholder={`0.00 ${wallet.currency}`}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    error && "border-red-300"
                  )}
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Deposit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}