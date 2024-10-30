import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { OTPVerification } from './otp-verification';
import { useWallets } from '@/hooks/use-wallets';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface WithdrawalFormProps {
  wallet: {
    id: string;
    country: string;
    currency: string;
    balance: number;
    bankAccount: {
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    };
  };
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PERCENTAGE_OPTIONS = [
  { label: '10%', value: 0.1 },
  { label: '30%', value: 0.3 },
  { label: '50%', value: 0.5 },
  { label: '70%', value: 0.7 },
  { label: 'Max', value: 1 }
];

export function WithdrawalForm({ wallet, onClose, onSuccess }: WithdrawalFormProps) {
  const { handleTransaction } = useWallets();
  const [amount, setAmount] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency,
    }).format(Number(number) / 100);
    
    return formatted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
    setError('');
  };

  const handlePercentageSelect = (percentage: number) => {
    const calculatedAmount = Math.floor(wallet.balance * percentage * 100);
    setAmount(calculatedAmount.toString());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawalAmount = Number(amount) / 100;
    
    if (withdrawalAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > wallet.balance) {
      setError('Insufficient funds');
      return;
    }

    // Show OTP verification
    setShowOTP(true);
  };

  const handleVerificationSuccess = async () => {
    setLoading(true);
    try {
      const withdrawalAmount = Number(amount) / 100;
      const updatedWallet = await handleTransaction(wallet.id, 'withdrawal', withdrawalAmount, 'Manual withdrawal');
      
      // Verify the transaction was successful by checking the new balance
      if (updatedWallet.balance !== wallet.balance - withdrawalAmount) {
        console.warn('Balance verification failed, please check your balance');
      }
      
      onSuccess(withdrawalAmount);
    } catch (error) {
      toast.error('Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Withdraw from {wallet.country} Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: wallet.currency
              }).format(wallet.balance)}
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Withdrawal Account</h3>
              <p className="text-sm text-gray-600">{wallet.bankAccount.bankName}</p>
              <p className="text-sm text-gray-500">Account ending in {wallet.bankAccount.accountNumber.slice(-4)}</p>
            </div>
          </div>

          {!showOTP ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount ? formatCurrency(amount) : ''}
                    onChange={handleAmountChange}
                    placeholder={`0.00 ${wallet.currency}`}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                      error && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {PERCENTAGE_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handlePercentageSelect(option.value)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
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
                  disabled={!amount || loading}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <OTPVerification
              onVerify={handleVerificationSuccess}
              onCancel={() => setShowOTP(false)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}