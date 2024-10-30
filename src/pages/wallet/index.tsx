import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye, EyeOff, Plus, Wallet as WalletIcon } from 'lucide-react';
import { WalletCard } from '@/components/wallet/wallet-card';
import { AddWalletForm } from '@/components/wallet/add-wallet-form';
import { SendMoneyForm } from '@/components/wallet/send-money-form';
import { useWallets } from '@/hooks/use-wallets';
import { Loader2 } from 'lucide-react';

interface LocationState {
  openTransfer?: boolean;
  selectedRecipient?: {
    id: string;
    fullName: string;
    avatar: string;
  };
}

export function Wallet() {
  const [hideBalance, setHideBalance] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const { wallets, loading, error } = useWallets();
  const location = useLocation();
  const state = location.state as LocationState;

  // Handle pre-selected recipient from Quick Transfer
  useEffect(() => {
    if (state?.openTransfer) {
      setShowTransfer(true);
    }
  }, [state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Wallet</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your multi-currency wallets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {hideBalance ? (
              <EyeOff className="w-5 h-5 text-gray-600" />
            ) : (
              <Eye className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setShowAddWallet(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {wallets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WalletIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets yet</h3>
            <p className="text-gray-500 mb-4">Add your first wallet to start managing your money</p>
            <button
              onClick={() => setShowAddWallet(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Wallet
            </button>
          </div>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              hideBalance={hideBalance}
            />
          ))
        )}
      </div>

      {showAddWallet && (
        <AddWalletForm onClose={() => setShowAddWallet(false)} />
      )}

      {showTransfer && (
        <SendMoneyForm 
          onClose={() => setShowTransfer(false)}
          preSelectedRecipient={state?.selectedRecipient}
          wallets={wallets}
        />
      )}
    </div>
  );
}