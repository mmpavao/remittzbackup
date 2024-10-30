import { CreditCard, QrCode, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  methods: string[];
  selectedMethod: string | null;
  onSelect: (method: string) => void;
  onContinue: () => void;
}

const methodIcons = {
  credit_card: CreditCard,
  pix: QrCode,
  boleto: Receipt,
};

const methodNames = {
  credit_card: 'Credit Card',
  pix: 'PIX',
  boleto: 'Boleto',
};

const methodDescriptions = {
  credit_card: 'Pay with Visa, Mastercard, or American Express',
  pix: 'Instant payment system (Brazil only)',
  boleto: 'Brazilian bank payment slip',
};

export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect,
  onContinue,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {methods.map(method => {
          const Icon = methodIcons[method as keyof typeof methodIcons];
          return (
            <button
              key={method}
              onClick={() => onSelect(method)}
              className={cn(
                "w-full flex items-center gap-4 p-4 border rounded-lg transition-colors",
                selectedMethod === method
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-200"
              )}
            >
              <div className={cn(
                "p-3 rounded-full",
                selectedMethod === method
                  ? "bg-emerald-100"
                  : "bg-gray-100"
              )}>
                <Icon className={cn(
                  "w-6 h-6",
                  selectedMethod === method
                    ? "text-emerald-600"
                    : "text-gray-600"
                )} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">
                  {methodNames[method as keyof typeof methodNames]}
                </h3>
                <p className="text-sm text-gray-500">
                  {methodDescriptions[method as keyof typeof methodDescriptions]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onContinue}
        disabled={!selectedMethod}
        className="w-full px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}