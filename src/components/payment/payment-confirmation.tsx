import { Check } from 'lucide-react';

interface PaymentConfirmationProps {
  amount: number;
  currency: string;
  onClose: () => void;
}

export function PaymentConfirmation({ amount, currency, onClose }: PaymentConfirmationProps) {
  const transactionId = Math.random().toString(36).substring(7).toUpperCase();
  
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-emerald-500" />
      </div>

      <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
      <p className="text-gray-500 mb-6">
        Your payment of {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency
        }).format(amount)} has been processed successfully.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
        <p className="font-mono font-medium">{transactionId}</p>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
      >
        Close
      </button>
    </div>
  );
}