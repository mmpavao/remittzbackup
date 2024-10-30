import { useState } from 'react';
import { SmartLinkList } from '@/components/smart-links/smart-link-list';
import { CreateSmartLinkForm } from '@/components/smart-links/create-smart-link-form';
import { Plus } from 'lucide-react';

const mockSmartLinks = [
  {
    id: '1',
    title: 'Monthly Subscription',
    description: 'Recurring payment for premium service',
    amount: 29.99,
    currency: 'USD',
    recipientCurrency: 'BRL',
    recipientAmount: 150.00,
    status: 'active',
    createdAt: '2024-03-15',
    expiresAt: '2024-04-15',
    paymentMethods: ['credit_card', 'pix', 'boleto'],
    totalPayments: 5,
    totalAmount: 149.95
  },
  {
    id: '2',
    title: 'One-time Payment',
    description: 'Single payment for consultation',
    amount: 100.00,
    currency: 'USD',
    recipientCurrency: 'BRL',
    recipientAmount: 500.00,
    status: 'expired',
    createdAt: '2024-03-10',
    expiresAt: '2024-03-12',
    paymentMethods: ['credit_card', 'pix'],
    totalPayments: 0,
    totalAmount: 0
  }
];

export function SmartLinks() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">SmartLinks</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage payment links</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create SmartLink
        </button>
      </div>

      <SmartLinkList smartLinks={mockSmartLinks} />

      {showCreateForm && (
        <CreateSmartLinkForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}