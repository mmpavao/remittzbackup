import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface EditWalletFormProps {
  wallet: {
    id: string;
    country: string;
    countryCode: string;
    currency: string;
    balance: number;
    bankAccount?: {
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    };
  };
  onClose: () => void;
  showBankWarning?: boolean;
}

const banks = [
  { id: 'chase', name: 'Chase Bank' },
  { id: 'bofa', name: 'Bank of America' },
  { id: 'wells', name: 'Wells Fargo' },
  { id: 'citi', name: 'Citibank' },
  { id: 'td', name: 'TD Bank' },
];

export function EditWalletForm({ wallet, onClose, showBankWarning }: EditWalletFormProps) {
  const [formData, setFormData] = useState({
    accountName: wallet.bankAccount?.bankName || '',
    accountNumber: wallet.bankAccount?.accountNumber || '',
    routingNumber: wallet.bankAccount?.routingNumber || '',
    bankName: wallet.bankAccount?.bankName || '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Wallet updated successfully');
    onClose();
  };

  const handleBankSelect = (bankName: string) => {
    setFormData(prev => ({ ...prev, bankName }));
    setShowBankList(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Edit Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {showBankWarning && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Bank Account Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please add your bank account details to enable withdrawals from this wallet.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowBankList(true);
                  }}
                  onFocus={() => setShowBankList(true)}
                  placeholder="Search banks..."
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200",
                    "focus:border-emerald-500 focus:ring-emerald-500"
                  )}
                />
                {showBankList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredBanks.map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => handleBankSelect(bank.name)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
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
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}