import { CreditCard, AlertTriangle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

interface CardListProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onTopUp: (card: Card) => void;
  onToggleStatus: (cardId: string) => void;
  onDelete: (card: Card) => void;
}

export function CardList({ cards, onCardClick, onTopUp, onToggleStatus, onDelete }: CardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-emerald-500 transition-all cursor-pointer group"
          onClick={() => onCardClick(card)}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-medium">{card.name}</h3>
              <p className="text-sm text-gray-500">•••• {card.last4}</p>
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle dropdown
                }}
                className="p-2 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              {/* Dropdown menu */}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: card.currency
              }).format(card.balance)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                {
                  'bg-emerald-100 text-emerald-800': card.status === 'active',
                  'bg-red-100 text-red-800': card.status === 'blocked',
                  'bg-gray-100 text-gray-800': card.status === 'expired'
                }
              )}>
                {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Expires {card.expiryDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTopUp(card);
                }}
                className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Top Up
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}