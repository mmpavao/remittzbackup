import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { initSumsubVerification } from '@/lib/sumsub';
import toast from 'react-hot-toast';

interface VerificationFlowProps {
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function VerificationFlow({ onComplete, onError }: VerificationFlowProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('sumsub-container');
    if (!container) return;

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const handleStartVerification = async () => {
    if (!user?.uid) {
      toast.error('Please log in to start verification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await initSumsubVerification({
        containerId: 'sumsub-container',
        onComplete: () => {
          if (onComplete) onComplete();
          toast.success('Verification submitted successfully');
        },
        onError: (error) => {
          if (onError) onError(error);
          setError(error.message);
          toast.error('Verification failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Verification error:', error);
      setError((error as Error).message);
      if (onError) onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Verification Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Identity Verification</h2>
            <p className="text-sm text-gray-500">Complete verification to unlock all features</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleStartVerification}
            disabled={loading}
            className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting Verification...
              </>
            ) : (
              'Start Verification'
            )}
          </button>

          <div id="sumsub-container" className="min-h-[400px]" />
        </div>
      </div>
    </div>
  );
}