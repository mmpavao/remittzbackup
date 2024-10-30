import { Loader2 } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';

interface PhoneFormProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  error?: string;
}

export function PhoneForm({ phone, onPhoneChange, onSubmit, loading, error }: PhoneFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <PhoneInput
          value={phone}
          onChange={onPhoneChange}
          error={error}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !phone}
        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : (
          'Send Code'
        )}
      </button>
    </form>
  );
}