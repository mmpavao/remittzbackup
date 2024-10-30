import { useState, useEffect } from 'react';
import { X, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { OTPVerification } from '../wallet/otp-verification';
import { NewRecipientForm } from '../wallet/new-recipient-form';
import { CheckoutModal } from './checkout-modal';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface SendMoneyFormProps {
  onClose: () => void;
  preSelectedUser?: {
    id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
  balance: number;
}

const mockUsers = [
  { id: '1', fullName: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '2', fullName: 'Michael Chen', email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '3', fullName: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
];

export function SendMoneyForm({ onClose, preSelectedUser, balance }: SendMoneyFormProps) {
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(preSelectedUser || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewRecipientForm, setShowNewRecipientForm] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
      setSearchTerm(preSelectedUser.fullName);
    }
  }, [preSelectedUser]);

  const filteredUsers = mockUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    if (!selectedUser) {
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
      toast.success(`Successfully sent ${formatCurrency(amount)} to ${selectedUser?.fullName}`);
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

          {!showNewRecipientForm && !showOTP && (
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
                      error && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchTerm(user.fullName);
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50"
                          >
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="text-left">
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-4">No recipients found</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewRecipientForm(true);
                              setShowDropdown(false);
                            }}
                            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                          >
                            <Plus className="w-4 h-4" />
                            Add New Recipient
                          </button>
                        </div>
                      )}
                    </div>
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
                    error && "border-red-300 focus:border-red-500 focus:ring-red-500"
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
                  disabled={!amount || !selectedUser || loading}
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

          {showNewRecipientForm && (
            <NewRecipientForm
              onSubmit={(newUser) => {
                setSelectedUser(newUser);
                setSearchTerm(newUser.fullName);
                setShowNewRecipientForm(false);
              }}
              onCancel={() => setShowNewRecipientForm(false)}
            />
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
    </div>
  );
}