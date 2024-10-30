import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface InviteFormProps {
  type: 'email' | 'phone';
  onClose: () => void;
  onSubmit: (data: { type: 'email' | 'phone'; value: string }) => void;
}

export function InviteForm({ type, onClose, onSubmit }: InviteFormProps) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!value) {
      setError(`Please enter a ${type}`);
      return false;
    }

    if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ type, value });
      toast.success(`Invitation sent to ${value}`);
      onClose();
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Send {type === 'email' ? 'Email' : 'SMS'} Invitation
            </h2>
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
                {type === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              {type === 'email' ? (
                <input
                  type="email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                    error && "border-red-300"
                  )}
                />
              ) : (
                <PhoneInput
                  value={value}
                  onChange={setValue}
                  error={error}
                />
              )}
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
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Send Invitation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}