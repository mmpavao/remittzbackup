import { useState } from 'react';
import { Globe, CreditCard, QrCode, Receipt, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: typeof CreditCard;
  description: string;
  currencies: string[];
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
];

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    icon: CreditCard,
    description: 'Pay with Visa, Mastercard, or American Express',
    currencies: ['USD', 'EUR', 'GBP', 'BRL'],
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: QrCode,
    description: 'Instant payment system (Brazil only)',
    currencies: ['BRL'],
  },
  {
    id: 'boleto',
    name: 'Boleto',
    icon: Receipt,
    description: 'Brazilian bank payment slip',
    currencies: ['BRL'],
  },
];

export function PaymentCheckout() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [showCurrencies, setShowCurrencies] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const amount = 99.99; // This would come from the URL or API in a real app

  const availablePaymentMethods = paymentMethods.filter(method =>
    method.currencies.includes(selectedCurrency.code)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold">SmartPay</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Globe className="w-4 h-4" />
                {selectedLanguage.flag} {selectedLanguage.name}
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {languages.map(language => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setShowLanguages(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {language.flag} {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCurrencies(!showCurrencies)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {selectedCurrency.flag} {selectedCurrency.code}
              </button>

              {showCurrencies && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {currencies.map(currency => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setShowCurrencies(false);
                        setSelectedMethod(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {currency.flag} {currency.name} ({currency.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-lg font-semibold mb-4">Order Summary</h1>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat(selectedLanguage.code, {
                  style: 'currency',
                  currency: selectedCurrency.code
                }).format(amount)}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
            <div className="space-y-4">
              {availablePaymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 border rounded-lg transition-colors",
                    selectedMethod === method.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-200"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full",
                    selectedMethod === method.id
                      ? "bg-emerald-100"
                      : "bg-gray-100"
                  )}>
                    <method.icon className={cn(
                      "w-6 h-6",
                      selectedMethod === method.id
                        ? "text-emerald-600"
                        : "text-gray-600"
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  <ChevronRight className={cn(
                    "w-5 h-5",
                    selectedMethod === method.id
                      ? "text-emerald-600"
                      : "text-gray-400"
                  )} />
                </button>
              ))}
            </div>

            <button
              disabled={!selectedMethod}
              className="w-full mt-6 px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Secured by SmartPay • All rights reserved • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}