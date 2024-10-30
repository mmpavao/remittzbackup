import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BankSelector } from './bank-selector';
import { PhoneInput } from '@/components/ui/phone-input';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

interface NewRecipientFormProps {
  onSubmit: (user: {
    id: string;
    fullName: string;
    email: string;
    avatar: string;
  }) => void;
  onCancel: () => void;
}

export function NewRecipientForm({ onSubmit, onCancel }: NewRecipientFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!selectedBank) {
      newErrors.bank = 'Please select a bank';
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
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate avatar URL using initials
      const initials = formData.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random&size=128`,
      };

      onSubmit(newUser);
      toast.success('Recipient added successfully');
    } catch (error) {
      toast.error('Failed to add recipient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Recipient</h3>
      </div>

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
            errors.fullName && "border-red-300 focus:border-red-500 focus:ring-red-500"
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
            errors.email && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <PhoneInput
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          error={errors.phone}
        />
      </div>

      <BankSelector
        selectedBank={selectedBank}
        onSelect={setSelectedBank}
        country="United States"
        error={errors.bank}
      />

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
            errors.accountNumber && "border-red-300 focus:border-red-500 focus:ring-red-500"
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
            errors.routingNumber && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {errors.routingNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
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
            'Add Recipient'
          )}
        </button>
      </div>
    </form>
  );
}