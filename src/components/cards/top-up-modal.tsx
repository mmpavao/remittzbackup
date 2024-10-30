import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopUpModalProps {
  card: {
    id: string;
    last4: string;
    name: string;
    balance: number;
    currency: string;
  };
  onSubmit: (amount: number) => Promise<void>;
  onClose: () => void;
}

export function TopUpCardModal({ card, onSubmit, onClose }: TopUpModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: card.currency,
    }).format(Number(number) / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const topUpAmount = Number(amount) / 100;
    if (topUpAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(topUpAmount);
      onClose();
    } catch (error) {
      setError('Failed to top up card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Top Up Card</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Card Details</p>
              <p className="font-medium">{card.name}</p>
              <p className="text-sm text-gray-500">•••• {card.last4}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                value={amount ? formatCurrency(amount) : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setAmount(value);
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  error && "border-red-300"
                )}
                placeholder={`0.00 ${card.currency}`}
              />
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
                  'Top Up'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}