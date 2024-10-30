import { Plus, CreditCard } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Card {
  id: string;
  last4: string;
  balance: number;
  expiryDate: string;
}

export function CardSection() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      last4: '1890',
      balance: 32819.00,
      expiryDate: '05/25'
    }
  ]);

  const handleAddCard = () => {
    toast.success('Card request initiated. Our team will contact you shortly.');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Your Cards</h2>
        <button 
          onClick={handleAddCard}
          className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Card
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <div className="absolute top-4 right-4">
              <CreditCard className="w-8 h-8 opacity-50" />
            </div>
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-sm opacity-75">Current Balance</p>
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
        ))}
      </div>
    </div>
  );
}