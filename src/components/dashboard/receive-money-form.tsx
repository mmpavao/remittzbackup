import { useState } from 'react';
import { X, Search, Plus, Loader2, AlertCircle, Phone } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { NewRecipientForm } from '@/components/wallet/new-recipient-form';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ReceiveMoneyFormProps {
  onClose: () => void;
}

const mockUsers = [
  { id: '1', fullName: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '2', fullName: 'Michael Chen', email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '3', fullName: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
];

export function ReceiveMoneyForm({ onClose }: ReceiveMoneyFormProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewRecipientForm, setShowNewRecipientForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<'user' | 'phone'>('user');

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

    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    if (method === 'user' && !selectedUser) {
      setError('Please select a recipient');
      return;
    }

    if (method === 'phone' && !phone) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (method === 'user') {
        toast.success(`Payment request sent to ${selectedUser?.fullName}`);
      } else {
        toast.success('SMS invitation sent with payment request');
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to send payment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Request Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!showNewRecipientForm && (
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
                  placeholder="$0.00"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    error && "border-red-300"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's it for?"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMethod('user')}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-md transition-colors",
                    method === 'user'
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Select User
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-md transition-colors",
                    method === 'phone'
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Phone Number
                </button>
              </div>

              {method === 'user' ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    error={error}
                  />
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    They'll receive an SMS with the payment request
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}

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
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Request Payment'
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
        </div>
      </div>
    </div>
  );
}