import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreateSmartLinkFormProps {
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'pix', label: 'PIX' },
  { id: 'boleto', label: 'Boleto' }
];

export function CreateSmartLinkForm({ onClose }: CreateSmartLinkFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    recipientAmount: '',
    recipientCurrency: 'BRL',
    expirationDate: '',
    paymentMethods: ['credit_card', 'pix', 'boleto'],
    installments: false,
    maxInstallments: 12,
    recipientId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Mock exchange rate
  const exchangeRate = 5.0;

  const handleAmountChange = (field: 'amount' | 'recipientAmount', value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const newAmount = parseFloat(numericValue) || 0;

    if (field === 'amount') {
      setFormData({
        ...formData,
        amount: numericValue,
        recipientAmount: (newAmount * exchangeRate).toFixed(2),
      });
    } else {
      setFormData({
        ...formData,
        recipientAmount: numericValue,
        amount: (newAmount / exchangeRate).toFixed(2),
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    }
    if (!formData.recipientId.trim()) {
      newErrors.recipientId = 'Recipient is required';
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    }
    if (formData.paymentMethods.length === 0) {
      newErrors.paymentMethods = 'At least one payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    toast.success('SmartLink created successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Create SmartLink</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('form')}
              className={cn(
                "px-4 py-2 rounded-lg",
                activeTab === 'form'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Form
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                "px-4 py-2 rounded-lg",
                activeTab === 'preview'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Preview
            </button>
          </div>

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    errors.title && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    You'll Receive ({formData.recipientCurrency})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.recipientAmount}
                      onChange={(e) => handleAmountChange('recipientAmount', e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                        errors.amount && "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    They'll Pay ({formData.currency})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => handleAmountChange('amount', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient ID
                </label>
                <input
                  type="text"
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    errors.recipientId && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.recipientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipientId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    errors.expirationDate && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Methods
                </label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method.id)}
                        onChange={(e) => {
                          const newMethods = e.target.checked
                            ? [...formData.paymentMethods, method.id]
                            : formData.paymentMethods.filter(m => m !== method.id);
                          setFormData({ ...formData, paymentMethods: newMethods });
                        }}
                        className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
                {errors.paymentMethods && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethods}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  Allow Installments
                </label>

                {formData.installments && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Installments
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, maxInstallments: Math.max(1, formData.maxInstallments - 1) })}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={formData.maxInstallments}
                        onChange={(e) => setFormData({ ...formData, maxInstallments: Math.min(12, Math.max(1, parseInt(e.target.value) || 1)) })}
                        min="1"
                        max="12"
                        className="w-20 text-center px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, maxInstallments: Math.min(12, formData.maxInstallments + 1) })}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Create SmartLink
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">{formData.title || 'Payment Title'}</h3>
                {formData.description && (
                  <p className="text-gray-600 mb-6">{formData.description}</p>
                )}

                <div className="text-center mb-6">
                  <p className="text-3xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: formData.currency
                    }).format(parseFloat(formData.amount) || 0)}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-2">
                    {formData.paymentMethods.map((method) => (
                      <button
                        key={method}
                        className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                      >
                        {method === 'credit_card' && 'Credit Card'}
                        {method === 'pix' && 'PIX'}
                        {method === 'boleto' && 'Boleto'}
                      </button>
                    ))}
                  </div>

                  {formData.installments && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-600 text-center">
                        Up to {formData.maxInstallments}x installments available
                      </p>
                    </div>
                  )}

                  <button className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}