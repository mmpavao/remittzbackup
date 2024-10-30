import { useState } from 'react';
import { TransactionList } from '@/components/transactions/transaction-list';

const mockTransactions = [
  {
    id: '1',
    type: 'incoming',
    amount: 500.00,
    currency: 'USD',
    description: 'Payment from John Doe',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: '2',
    type: 'outgoing',
    amount: 50.00,
    currency: 'USD',
    description: 'Netflix Subscription',
    date: '2024-03-14',
    status: 'completed'
  },
  {
    id: '3',
    type: 'incoming',
    amount: 1000.00,
    currency: 'EUR',
    description: 'Salary Payment',
    date: '2024-03-13',
    status: 'completed'
  },
  {
    id: '4',
    type: 'outgoing',
    amount: 75.50,
    currency: 'GBP',
    description: 'Amazon Purchase',
    date: '2024-03-12',
    status: 'pending'
  },
  {
    id: '5',
    type: 'incoming',
    amount: 250.00,
    currency: 'USD',
    description: 'Freelance Payment',
    date: '2024-03-11',
    status: 'completed'
  }
] as const;

export function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all your transactions</p>
      </div>

      <TransactionList transactions={mockTransactions} />
    </div>
  );
}