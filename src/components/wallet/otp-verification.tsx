import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  onVerify: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function OTPVerification({ onVerify, onCancel, loading }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== '123456') {
      setError('Invalid verification code');
      return;
    }

    await onVerify();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Verification Required</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please enter the verification code sent to your phone
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            For testing, use code: 123456
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}