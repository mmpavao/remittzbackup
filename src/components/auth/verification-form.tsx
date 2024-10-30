import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

export function VerificationForm({ onSubmit, loading, error }: VerificationFormProps) {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(verificationCode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || verificationCode.length !== 6}
        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : (
          'Verify Code'
        )}
      </button>
    </form>
  );
}