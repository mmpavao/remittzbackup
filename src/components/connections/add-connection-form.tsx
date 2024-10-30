import { useState } from 'react';
import { X, Plus, Minus, Loader2 } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { useConnections } from '@/hooks/use-connections';
import { cn } from '@/lib/utils';

interface BankAccount {
  currency: string;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  agencia?: string;
  swift?: string;
  iban?: string;
}

interface AddConnectionFormProps {
  onClose: () => void;
}

export function AddConnectionForm({ onClose }: AddConnectionFormProps) {
  const { addConnection, loading } = useConnections();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bankAccounts: [] as BankAccount[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, {
        currency: 'USD',
        bankName: '',
        accountNumber: ''
      }]
    });
  };

  const handleRemoveBankAccount = (index: number) => {
    const newAccounts = [...formData.bankAccounts];
    newAccounts.splice(index, 1);
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = [...formData.bankAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    formData.bankAccounts.forEach((account, index) => {
      if (!account.bankName) {
        newErrors[`bankName_${index}`] = 'Bank name is required';
      }
      if (!account.accountNumber) {
        newErrors[`accountNumber_${index}`] = 'Account number is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await addConnection({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bankAccounts: formData.bankAccounts
      });
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add New Connection</h2>
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
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.email && "border-red-300"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Bank Accounts</h3>
                <button
                  type="button"
                  onClick={handleAddBankAccount}
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                </button>
              </div>

              {formData.bankAccounts.map((account, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Account {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveBankAccount(index)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={account.currency}
                        onChange={(e) => handleBankAccountChange(index, 'currency', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BRL">BRL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={account.bankName}
                        onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                          errors[`bankName_${index}`] && "border-red-300"
                        )}
                      />
                      {errors[`bankName_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`bankName_${index}`]}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={account.accountNumber}
                        onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                          errors[`accountNumber_${index}`] && "border-red-300"
                        )}
                      />
                      {errors[`accountNumber_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`accountNumber_${index}`]}</p>
                      )}
                    </div>

                    {account.currency === 'USD' && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          value={account.routingNumber || ''}
                          onChange={(e) => handleBankAccountChange(index, 'routingNumber', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {account.currency === 'BRL' && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agência
                        </label>
                        <input
                          type="text"
                          value={account.agencia || ''}
                          onChange={(e) => handleBankAccountChange(index, 'agencia', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    )}

                    {(account.currency === 'EUR' || account.currency === 'GBP') && (
                      <>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SWIFT/BIC
                          </label>
                          <input
                            type="text"
                            value={account.swift || ''}
                            onChange={(e) => handleBankAccountChange(index, 'swift', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IBAN
                          </label>
                          <input
                            type="text"
                            value={account.iban || ''}
                            onChange={(e) => handleBankAccountChange(index, 'iban', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
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
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Add Connection'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}