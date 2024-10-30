import { useState } from 'react';
import { X, Search, Plus, Loader2 } from 'lucide-react';
import { OTPVerification } from './otp-verification';
import { NewRecipientForm } from './new-recipient-form';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  recentTransfer?: boolean;
}

interface TransferFormProps {
  wallet: {
    id: string;
    country: string;
    currency: string;
    balance: number;
  };
  onClose: () => void;
  onSuccess: (amount: number, recipient: User) => void;
}

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '1', fullName: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', recentTransfer: true },
  { id: '2', fullName: 'Michael Chen', email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', recentTransfer: true },
  { id: '3', fullName: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', recentTransfer: true },
  { id: '4', fullName: 'David Miller', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '5', fullName: 'Emma Thompson', email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
];

export function TransferForm({ wallet, onClose, onSuccess }: TransferFormProps) {
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewRecipientForm, setShowNewRecipientForm] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentTransfers = mockUsers.filter(user => user.recentTransfer);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setError('Please select a recipient');
      return;
    }

    const transferAmount = Number(amount) / 100;
    
    if (transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transferAmount > wallet.balance) {
      setError('Insufficient funds');
      return;
    }

    setShowOTP(true);
  };

  const handleVerificationSuccess = async () => {
    setLoading(true);
    try {
      const transferAmount = Number(amount) / 100;
      
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(transferAmount, selectedUser!);
      onClose();
    } catch (error) {
      toast.error('Failed to process transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTransfer = (user: User) => {
    setSelectedUser(user);
    setShowDropdown(false);
    setSearchTerm(user.fullName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transfer Money</h2>
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

          {!showNewRecipientForm && !showOTP && (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Transfer</h3>
                <div className="flex items-center space-x-2 mb-4">
                  {recentTransfers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleQuickTransfer(user)}
                      className="flex-shrink-0 group relative"
                    >
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full ring-2 ring-white group-hover:ring-emerald-500 transition-all"
                      />
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-900 text-white px-2 py-1 rounded-md whitespace-nowrap">
                        {user.fullName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
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
                    Amount to Transfer
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
                    Continue
                  </button>
                </div>
              </form>
            </>
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
        </div>
      </div>
    </div>
  );
}