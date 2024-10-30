import { useState, useEffect } from 'react';
import { X, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { OTPVerification } from './otp-verification';
import { SelectRecipientModal } from './select-recipient-modal';
import { CheckoutModal } from '../dashboard/checkout-modal';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface SendMoneyFormProps {
  onClose: () => void;
  preSelectedRecipient?: {
    id: string;
    fullName: string;
    avatar: string;
  };
  balance: number;
}

export function SendMoneyForm({ onClose, preSelectedRecipient, balance }: SendMoneyFormProps) {
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(preSelectedRecipient || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSelectRecipient, setShowSelectRecipient] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set initial search term if there's a pre-selected recipient
  useEffect(() => {
    if (preSelectedRecipient) {
      setSearchTerm(preSelectedRecipient.fullName);
    }
  }, [preSelectedRecipient]);

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(number) / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRecipient) {
      setError('Please select a recipient');
      return;
    }

    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    const transferAmount = Number(amount) / 100;

    if (transferAmount > balance) {
      const remaining = transferAmount - balance;
      setShowCheckout(true);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOTP(true);
    } catch (error) {
      toast.error('Failed to initiate transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Successfully sent ${formatCurrency(amount)} to ${selectedRecipient?.fullName}`);
      onClose();
    } catch (error) {
      toast.error('Transfer failed');
    }
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowOTP(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Send Money</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-semibold">
                {formatCurrency((balance * 100).toString())}
              </p>
            </div>
          </div>

          {!showOTP && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search by name or email"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                      error && "border-red-300"
                    )}
                    readOnly={!!selectedRecipient}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  
                  {!selectedRecipient && showDropdown && (
                    <button
                      type="button"
                      onClick={() => setShowSelectRecipient(true)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

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
                  placeholder="$0.00"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    error && "border-red-300"
                  )}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
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
                  disabled={!amount || !selectedRecipient || loading}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          )}

          {showOTP && (
            <OTPVerification
              onVerify={handleVerificationSuccess}
              onCancel={() => setShowOTP(false)}
              loading={loading}
            />
          )}

          {showCheckout && (
            <CheckoutModal
              amount={Number(amount) / 100 - balance}
              onSuccess={handleCheckoutSuccess}
              onClose={() => setShowCheckout(false)}
            />
          )}
        </div>
      </div>

      {showSelectRecipient && (
        <SelectRecipientModal
          onSelect={(recipient) => {
            setSelectedRecipient(recipient);
            setSearchTerm(recipient.fullName);
            setShowSelectRecipient(false);
          }}
          onClose={() => setShowSelectRecipient(false)}
        />
      )}
    </div>
  );
}