import { useState } from 'react';
import { X, Plus, Minus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { BankSelector } from './bank-selector';
import { DebugCard } from './debug-card';
import { createWallet } from '@/lib/wallet';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AddWalletFormProps {
  onClose: () => void;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', country: 'United States', countryCode: 'US' },
  { code: 'EUR', name: 'Euro', country: 'European Union', countryCode: 'EU' },
  { code: 'GBP', name: 'British Pound', country: 'United Kingdom', countryCode: 'GB' },
  { code: 'BRL', name: 'Brazilian Real', country: 'Brazil', countryCode: 'BR' }
];

export function AddWalletForm({ onClose }: AddWalletFormProps) {
  const { userData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [formData, setFormData] = useState({
    currency: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currency) {
      newErrors.currency = 'Please select a currency';
    }
    if (!selectedBank) {
      newErrors.bank = 'Please select a bank';
    }
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    if (!formData.routingNumber.trim()) {
      newErrors.routingNumber = 'Routing number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addDebugLog('Form validation failed');
      return;
    }

    if (!userData?.uid) {
      addDebugLog('User not authenticated');
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    addDebugLog('Starting wallet creation process');

    try {
      const selectedCurrency = currencies.find(c => c.code === formData.currency);
      if (!selectedCurrency) {
        throw new Error('Invalid currency selected');
      }

      addDebugLog(`Creating wallet with currency: ${selectedCurrency.code}`);
      addDebugLog(`Bank details: ${JSON.stringify(selectedBank)}`);

      const walletData = {
        country: selectedCurrency.country,
        countryCode: selectedCurrency.countryCode,
        currency: selectedCurrency.code,
        bankAccount: {
          bankName: selectedBank.name,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
        }
      };

      addDebugLog(`Wallet data prepared: ${JSON.stringify(walletData)}`);

      // Create wallet in Firebase
      const newWallet = await createWallet(userData.uid, walletData);
      
      addDebugLog(`Wallet created successfully with ID: ${newWallet.id}`);
      toast.success('Wallet added successfully');
      onClose();
    } catch (error: any) {
      addDebugLog(`Error creating wallet: ${error.message}`);
      toast.error(error.message || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.code === formData.currency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add New Wallet</h2>
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
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.currency && "border-red-300"
                )}
              >
                <option value="">Select Currency</option>
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
              )}
            </div>

            {selectedCurrency && (
              <BankSelector
                selectedBank={selectedBank}
                onSelect={setSelectedBank}
                country={selectedCurrency.country}
                error={errors.bank}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.accountName && "border-red-300"
                )}
              />
              {errors.accountName && (
                <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.accountNumber && "border-red-300"
                )}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.routingNumber && "border-red-300"
                )}
              />
              {errors.routingNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
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
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Add Wallet'
                )}
              </button>
            </div>
          </form>

          {/* Debug Card - Only visible for master admin */}
          {userData?.isMasterAccount && debugLogs.length > 0 && (
            <DebugCard logs={debugLogs} />
          )}
        </div>
      </div>
    </div>
  );
}