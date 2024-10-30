import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { CreditCard, Copy, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { TopUpCardModal } from '@/components/cards/top-up-modal';
import { DeleteCardDialog } from '@/components/cards/delete-card-dialog';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'payment' | 'refund';
  amount: number;
  merchant: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockCard = {
  id: '1',
  last4: '1890',
  name: 'Primary Card',
  balance: 32819.00,
  currency: 'USD',
  status: 'active' as const,
  expiryDate: '05/25',
  spendingLimit: 50000,
  type: 'physical' as const,
  cardNumber: '4111 •••• •••• 1890',
  cvv: '***',
  transactions: [
    {
      id: '1',
      type: 'payment',
      amount: 29.99,
      merchant: 'Netflix',
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'payment',
      amount: 12.99,
      merchant: 'Spotify',
      date: '2024-03-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'refund',
      amount: 50.00,
      merchant: 'Amazon',
      date: '2024-03-13',
      status: 'completed'
    }
  ] as Transaction[]
};

export function CardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(mockCard.cardNumber.replace(/[•\s]/g, ''));
    toast.success('Card number copied to clipboard');
  };

  const handleTopUp = async (amount: number) => {
    try {
      // In a real app, make API call here
      toast.success(`Successfully topped up ${amount} ${mockCard.currency}`);
      setShowTopUp(false);
    } catch (error) {
      toast.error('Failed to top up card');
    }
  };

  const handleDelete = async () => {
    try {
      // In a real app, make API call here
      toast.success('Card deleted successfully');
      navigate('/cards');
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Card Details"
        subtitle="View and manage your card"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Cards', href: '/cards' },
          { label: mockCard.name }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white overflow-hidden">
              <div className="absolute top-4 right-4">
                <CreditCard className="w-8 h-8 opacity-50" />
              </div>
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-sm opacity-75">Current Balance</p>
                  <h3 className="text-2xl font-semibold">
                    ${mockCard.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div>
                  <p className="text-lg">•••• •••• •••• {mockCard.last4}</p>
                  <p className="text-sm opacity-75 mt-1">Valid until {mockCard.expiryDate}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Card Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{mockCard.cardNumber}</p>
                    <button
                      onClick={() => setShowCardNumber(!showCardNumber)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showCardNumber ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={handleCopyNumber}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">CVV</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{showCVV ? '123' : '***'}</p>
                    <button
                      onClick={() => setShowCVV(!showCVV)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showCVV ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Card Type</p>
                  <p className="font-medium capitalize">{mockCard.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{mockCard.status}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Spending Limit</p>
                  <p className="font-medium">
                    ${mockCard.spendingLimit.toLocaleString('en-US')}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {mockCard.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'refund' ? 'text-emerald-600' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'refund' ? '+' : '-'} ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Card Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowTopUp(true)}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Top Up
              </button>
              <button
                onClick={() => navigate('/cards')}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back to Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTopUp && (
        <TopUpCardModal
          card={mockCard}
          onSubmit={handleTopUp}
          onClose={() => setShowTopUp(false)}
        />
      )}

      {showDelete && (
        <DeleteCardDialog
          card={mockCard}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}