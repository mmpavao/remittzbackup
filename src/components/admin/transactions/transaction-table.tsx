import { useState } from 'react';
import { 
  Search, Filter, Calendar, Download,
  ChevronDown, ChevronUp, ArrowUpDown
} from 'lucide-react';
import { DateRangePicker } from '@/components/transactions/date-range-picker';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'disputed';
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit';
  sender: {
    id: string;
    name: string;
    email: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  description: string;
  metadata: Record<string, any>;
}

interface TransactionTableProps {
  onViewTransaction: (transaction: Transaction) => void;
}

export function TransactionTable({ onViewTransaction }: TransactionTableProps) {
  const [transactions] = useState<Transaction[]>([
    {
      id: 'tx_1',
      date: '2024-03-15T10:30:00',
      amount: 1500.00,
      currency: 'USD',
      status: 'completed',
      type: 'payment',
      sender: {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      recipient: {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      description: 'Product purchase',
      metadata: {
        paymentMethod: 'credit_card',
        cardLast4: '4242'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesType = !typeFilter || transaction.type === typeFilter;
      
      const matchesDate = !dateRange || (
        new Date(transaction.date) >= dateRange.from &&
        new Date(transaction.date) <= dateRange.to
      );

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(String(bValue))
        : Number(aValue) - Number(bValue);
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleExport = () => {
    // Implement CSV export functionality
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="disputed">Disputed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Types</option>
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="deposit">Deposit</option>
        </select>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        >
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date Range</span>
          </button>
        </DateRangePicker>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => onViewTransaction(transaction)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      {
                        'bg-blue-100 text-blue-800': transaction.type === 'payment',
                        'bg-orange-100 text-orange-800': transaction.type === 'refund',
                        'bg-purple-100 text-purple-800': transaction.type === 'withdrawal',
                        'bg-green-100 text-green-800': transaction.type === 'deposit'
                      }
                    )}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{transaction.sender.name}</div>
                      <div className="text-gray-500">{transaction.sender.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{transaction.recipient.name}</div>
                      <div className="text-gray-500">{transaction.recipient.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: transaction.currency
                      }).format(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      {
                        'bg-emerald-100 text-emerald-800': transaction.status === 'completed',
                        'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                        'bg-red-100 text-red-800': transaction.status === 'failed',
                        'bg-orange-100 text-orange-800': transaction.status === 'disputed'
                      }
                    )}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}