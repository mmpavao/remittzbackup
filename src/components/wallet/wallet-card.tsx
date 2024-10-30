import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, MoreVertical, Pencil, ListOrdered, Trash2 } from 'lucide-react';
import { DepositForm } from './deposit-form';
import { EditWalletForm } from './edit-wallet-form';
import { WalletTransactions } from './wallet-transactions';
import { TransferForm } from './transfer-form';
import { WithdrawalForm } from './withdrawal-form';
import { cn } from '@/lib/utils';
import { Wallet } from '@/lib/wallet';
import { useWallets } from '@/hooks/use-wallets';
import toast from 'react-hot-toast';

interface WalletCardProps {
  wallet: Wallet;
  hideBalance: boolean;
  onBalanceUpdate?: (walletId: string, newBalance: number) => void;
}

export function WalletCard({ wallet, hideBalance, onBalanceUpdate }: WalletCardProps) {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(wallet.balance);
  const { removeWallet, makePrimary } = useWallets();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency,
    }).format(amount);
  };

  const handleWithdraw = () => {
    if (!wallet.bankAccount) {
      setShowEditForm(true);
      return;
    }
    setShowWithdrawalForm(true);
  };

  const handleDelete = async () => {
    try {
      await removeWallet(wallet.id);
      setShowDeleteConfirm(false);
      setShowMenu(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSetPrimary = async () => {
    try {
      await makePrimary(wallet.id);
      setShowMenu(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setCurrentBalance(newBalance);
    if (onBalanceUpdate) {
      onBalanceUpdate(wallet.id, newBalance);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={`https://flagcdn.com/w80/${wallet.countryCode.toLowerCase()}.png`}
                alt={wallet.country}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{wallet.country} Account</h3>
              {wallet.isPrimary && (
                <span className="inline-block px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full mt-1">
                  Primary Wallet
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={() => {
                    setShowEditForm(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowTransactions(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ListOrdered className="w-4 h-4" />
                  Transactions
                </button>
                {!wallet.isPrimary && (
                  <button
                    onClick={handleSetPrimary}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-emerald-600 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Set as Primary
                  </button>
                )}
                {!wallet.isPrimary && currentBalance === 0 && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Available Balance</p>
          <h4 className="text-2xl font-semibold">
            {hideBalance ? '••••••' : formatCurrency(currentBalance)}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDepositForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Deposit
          </button>
          <button 
            onClick={() => setShowTransferForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Transfer
          </button>
          <button 
            onClick={handleWithdraw}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {showDepositForm && (
        <DepositForm 
          wallet={{
            ...wallet,
            balance: currentBalance
          }}
          onClose={() => setShowDepositForm(false)}
          onSuccess={(amount) => {
            handleBalanceUpdate(currentBalance + amount);
            setShowDepositForm(false);
          }}
        />
      )}

      {showEditForm && (
        <EditWalletForm
          wallet={wallet}
          onClose={() => setShowEditForm(false)}
          showBankWarning={!wallet.bankAccount}
        />
      )}

      {showTransactions && (
        <WalletTransactions
          wallet={wallet}
          onClose={() => setShowTransactions(false)}
        />
      )}

      {showTransferForm && (
        <TransferForm
          wallet={{
            ...wallet,
            balance: currentBalance
          }}
          onClose={() => setShowTransferForm(false)}
          onSuccess={(amount, recipient) => {
            handleBalanceUpdate(currentBalance - amount);
            toast.success(`Successfully transferred ${formatCurrency(amount)} to ${recipient.fullName}`);
            setShowTransferForm(false);
          }}
        />
      )}

      {showWithdrawalForm && wallet.bankAccount && (
        <WithdrawalForm
          wallet={{
            ...wallet,
            balance: currentBalance
          }}
          onClose={() => setShowWithdrawalForm(false)}
          onSuccess={(amount) => {
            handleBalanceUpdate(currentBalance - amount);
            setShowWithdrawalForm(false);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Wallet</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this wallet? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}