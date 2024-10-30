import { useState } from 'react';
import { X, CreditCard, QrCode, Receipt, Check, Loader2 } from 'lucide-react';
import { PaymentMethodSelector } from './payment-method-selector';
import { PaymentForm } from './payment-form';
import { PaymentConfirmation } from './payment-confirmation';
import { cn } from '@/lib/utils';

interface PaymentFlowModalProps {
  link: {
    id: string;
    title: string;
    description?: string;
    amount: number;
    currency: string;
    paymentMethods: string[];
  };
  onClose: () => void;
}

type PaymentStep = 'method' | 'details' | 'processing' | 'confirmation';

export function PaymentFlowModal({ link, onClose }: PaymentFlowModalProps) {
  const [step, setStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePaymentSubmit = async () => {
    setStep('processing');
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className={cn(
                "h-2 rounded-full transition-all duration-300",
                {
                  'bg-emerald-500': step === 'method',
                  'bg-gray-200': step !== 'method'
                }
              )} />
            </div>
            <div className="flex-1 mx-1">
              <div className={cn(
                "h-2 rounded-full transition-all duration-300",
                {
                  'bg-emerald-500': step === 'details',
                  'bg-gray-200': step !== 'details'
                }
              )} />
            </div>
            <div className="flex-1">
              <div className={cn(
                "h-2 rounded-full transition-all duration-300",
                {
                  'bg-emerald-500': ['processing', 'confirmation'].includes(step),
                  'bg-gray-200': !['processing', 'confirmation'].includes(step)
                }
              )} />
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Payment Method</span>
            <span>Details</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && (
            <PaymentMethodSelector
              methods={link.paymentMethods}
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
              onContinue={() => setStep('details')}
            />
          )}

          {step === 'details' && selectedMethod && (
            <PaymentForm
              method={selectedMethod}
              amount={link.amount}
              currency={link.currency}
              onBack={() => setStep('method')}
              onSubmit={handlePaymentSubmit}
            />
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
              <p className="text-gray-500">Please wait while we process your payment...</p>
            </div>
          )}

          {step === 'confirmation' && (
            <PaymentConfirmation
              amount={link.amount}
              currency={link.currency}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}