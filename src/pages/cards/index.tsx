import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AddCardModal } from '@/components/cards/add-card-modal';
import { DeleteCardDialog } from '@/components/cards/delete-card-dialog';
import { TopUpCardModal } from '@/components/cards/top-up-modal';
import toast from 'react-hot-toast';

interface Card {
  id: string;
  last4: string;
  name: string;
  balance: number;
  currency: string;
  status: 'active' | 'blocked' | 'expired';
  expiryDate: string;
  spendingLimit: number;
  type: 'virtual' | 'physical';
  colorScheme: 'emerald' | 'slate' | 'blue' | 'orange' | 'purple';
}

interface Transaction {
  id: string;
  cardId: string;
  type: 'payment' | 'refund';
  amount: number;
  merchant: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const cardColorSchemes = {
  emerald: 'from-emerald-500 to-emerald-600',
  slate: 'from-slate-700 to-slate-800',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600'
};

const mockCards: Card[] = [
  {
    id: '1',
    last4: '1890',
    name: 'Primary Card',
    balance: 32819.00,
    currency: 'USD',
    status: 'active',
    expiryDate: '05/25',
    spendingLimit: 50000,
    type: 'physical',
    colorScheme: 'emerald'
  },
  {
    id: '2',
    last4: '4321',
    name: 'Business Card',
    balance: 15000.00,
    currency: 'USD',
    status: 'active',
    expiryDate: '08/25',
    spendingLimit: 25000,
    type: 'physical',
    colorScheme: 'slate'
  },
  {
    id: '3',
    last4: '7890',
    name: 'Travel Card',
    balance: 5000.00,
    currency: 'USD',
    status: 'active',
    expiryDate: '12/25',
    spendingLimit: 10000,
    type: 'virtual',
    colorScheme: 'blue'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    cardId: '1',
    type: 'payment',
    amount: 29.99,
    merchant: 'Netflix',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: '2',
    cardId: '1',
    type: 'payment',
    amount: 12.99,
    merchant: 'Spotify',
    date: '2024-03-14',
    status: 'completed'
  },
  {
    id: '3',
    cardId: '2',
    type: 'refund',
    amount: 50.00,
    merchant: 'Amazon',
    date: '2024-03-13',
    status: 'completed'
  },
  {
    id: '4',
    cardId: '3',
    type: 'payment',
    amount: 75.50,
    merchant: 'Uber',
    date: '2024-03-12',
    status: 'completed'
  }
];

export function Cards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleAddCard = async (data: Partial<Card>) => {
    const availableSchemes = Object.keys(cardColorSchemes).filter(
      scheme => !cards.some(card => card.colorScheme === scheme)
    );
    
    const newCard = {
      ...data,
      id: Date.now().toString(),
      status: 'active',
      colorScheme: availableSchemes[0] || 'emerald'
    } as Card;
    
    setCards([...cards, newCard]);
    toast.success('Card added successfully');
  };

  const handleTopUp = async (amount: number) => {
    if (!selectedCard) return;
    
    const updatedCards = cards.map(card => {
      if (card.id === selectedCard.id) {
        return {
          ...card,
          balance: card.balance + amount
        };
      }
      return card;
    });
    
    setCards(updatedCards);
    toast.success('Card topped up successfully');
  };

  const handleDelete = async () => {
    if (!selectedCard) return;
    
    const updatedCards = cards.filter(card => card.id !== selectedCard.id);
    setCards(updatedCards);
    toast.success('Card deleted successfully');
  };

  const handleToggleStatus = async (cardId: string) => {
    const updatedCards = cards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          status: card.status === 'active' ? 'blocked' : 'active'
        };
      }
      return card;
    });
    
    setCards(updatedCards);
    toast.success('Card status updated successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cards</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payment cards</p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
          <p className="text-gray-500 mb-4">Add your first card to start managing your payments</p>
          <button
            onClick={() => setShowAddCard(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-emerald-500 transition-all cursor-pointer overflow-hidden"
              >
                <div 
                  onClick={() => navigate(`/cards/${card.id}`)}
                  className="p-6"
                >
                  <div className="relative aspect-[1.586/1] w-full">
                    <div className={`absolute inset-0 bg-gradient-to-r ${cardColorSchemes[card.colorScheme]} rounded-xl p-6 text-white overflow-hidden`}>
                      <div className="absolute top-4 right-4">
                        <CreditCard className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="h-full flex flex-col justify-between">
                        <div className="space-y-2">
                          <p className="text-sm opacity-75">Available Balance</p>
                          <h3 className="text-2xl font-semibold">
                            ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </h3>
                        </div>
                        <div>
                          <p className="text-lg">•••• •••• •••• {card.last4}</p>
                          <p className="text-sm opacity-75 mt-1">Valid until {card.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        card.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : card.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(card);
                          setShowTopUp(true);
                        }}
                        className="flex-1 sm:flex-none px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Top Up
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(card.id);
                        }}
                        className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded-lg transition-colors ${
                          card.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {card.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const card = cards.find(c => c.id === transaction.cardId);
                return (
                  <div
                    key={transaction.id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'payment' ? 'bg-red-100' : 'bg-emerald-100'
                      }`}>
                        {transaction.type === 'payment' ? (
                          <ArrowUpRight className={`w-5 h-5 ${
                            transaction.type === 'payment' ? 'text-red-600' : 'text-emerald-600'
                          }`} />
                        ) : (
                          <ArrowDownLeft className={`w-5 h-5 ${
                            transaction.type === 'payment' ? 'text-red-600' : 'text-emerald-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.merchant}</p>
                        <p className="text-sm text-gray-500">
                          {card?.name} •••• {card?.last4}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'payment' ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {transaction.type === 'payment' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showAddCard && (
        <AddCardModal
          onSubmit={handleAddCard}
          onClose={() => setShowAddCard(false)}
        />
      )}

      {showTopUp && selectedCard && (
        <TopUpCardModal
          card={selectedCard}
          onSubmit={handleTopUp}
          onClose={() => {
            setSelectedCard(null);
            setShowTopUp(false);
          }}
        />
      )}

      {showDelete && selectedCard && (
        <DeleteCardDialog
          card={selectedCard}
          onConfirm={handleDelete}
          onClose={() => {
            setSelectedCard(null);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}