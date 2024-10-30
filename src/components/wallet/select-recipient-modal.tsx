import { useState } from 'react';
import { X, Search, Plus, Mail, Phone, Loader2 } from 'lucide-react';
import { useReceivers } from '@/hooks/use-receivers';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Recipient {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar: string;
  lastTransaction?: string;
}

interface SelectRecipientModalProps {
  onSelect: (recipient: Recipient) => void;
  onClose: () => void;
}

type Tab = 'recent' | 'all' | 'register';

export function SelectRecipientModal({ onSelect, onClose }: SelectRecipientModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('recent');
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { receivers, loading, addReceiver } = useReceivers();
  
  const filteredReceivers = receivers.filter(receiver =>
    receiver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receiver.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentReceivers = receivers.filter(r => r.lastTransaction);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!registrationData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!registrationData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const receiver = await addReceiver(registrationData);
      
      if (receiver) {
        onSelect({
          id: receiver.id,
          fullName: receiver.fullName,
          email: receiver.email,
          phone: receiver.phone,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(receiver.fullName)}&background=random&size=128`
        });
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleInvite = (type: 'email' | 'phone') => {
    toast.success(`Invitation sent via ${type}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Select Recipient</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab !== 'register' && (
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipients..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('recent')}
              className={cn(
                "flex-1 py-2 text-sm rounded-lg transition-colors",
                activeTab === 'recent'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "flex-1 py-2 text-sm rounded-lg transition-colors",
                activeTab === 'all'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              All Recipients
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                "flex-1 py-2 text-sm rounded-lg transition-colors",
                activeTab === 'register'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Register New
            </button>
          </div>

          {activeTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500",
                    errors.fullName && "border-red-300"
                  )}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500",
                    errors.email && "border-red-300"
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <PhoneInput
                  value={registrationData.phone}
                  onChange={(value) => setRegistrationData({ ...registrationData, phone: value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Register Recipient'
                )}
              </button>
            </form>
          ) : (
            <>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  </div>
                ) : (activeTab === 'recent' ? recentReceivers : filteredReceivers).map((receiver) => (
                  <button
                    key={receiver.id}
                    onClick={() => onSelect(receiver)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img
                      src={receiver.avatar}
                      alt={receiver.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{receiver.fullName}</p>
                      <p className="text-sm text-gray-500">{receiver.email}</p>
                      {receiver.lastTransaction && (
                        <p className="text-xs text-gray-400">
                          Last transaction: {new Date(receiver.lastTransaction).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}

                {!loading && ((activeTab === 'recent' ? recentReceivers : filteredReceivers).length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No recipients found</p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleInvite('email')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email Invite
                      </button>
                      <button
                        onClick={() => handleInvite('phone')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Phone Invite
                      </button>
                      <button
                        onClick={() => setActiveTab('register')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}