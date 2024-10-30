import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface WalletBalance {
  id: string;
  currency: string;
  balance: number;
  country: string;
  countryCode: string;
  isPrimary: boolean;
}

interface WalletBalancesProps {
  wallets: WalletBalance[];
  compact?: boolean;
}

export function WalletBalances({ wallets, compact = false }: WalletBalancesProps) {
  const navigate = useNavigate();
  const primaryWallet = wallets.find(w => w.isPrimary);
  const otherWallets = wallets.filter(w => !w.isPrimary);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Primary Wallet */}
      {primaryWallet && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <button
              onClick={() => navigate('/wallet')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-3xl font-semibold">
            {formatCurrency(primaryWallet.balance, primaryWallet.currency)}
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            Primary Account
          </p>
        </div>
      )}

      {/* Other Wallets */}
      {otherWallets.length > 0 && (
        <div className={compact ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
          {otherWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => navigate('/wallet')}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://flagcdn.com/w40/${wallet.countryCode.toLowerCase()}.png`}
                  alt={wallet.country}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                  <p className="text-sm text-gray-500">{wallet.country}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}