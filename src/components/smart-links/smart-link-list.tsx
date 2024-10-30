import { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Calendar,
  Edit2, Trash2, Copy, ExternalLink
} from 'lucide-react';
import { DateRangePicker } from '@/components/transactions/date-range-picker';
import { PaymentFlowModal } from '@/components/payment/payment-flow-modal';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SmartLink {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  recipientCurrency: string;
  recipientAmount: number;
  status: 'active' | 'expired' | 'disabled';
  createdAt: string;
  expiresAt: string;
  paymentMethods: string[];
  totalPayments: number;
  totalAmount: number;
}

interface SmartLinkListProps {
  smartLinks: SmartLink[];
}

export function SmartLinkList({ smartLinks: initialSmartLinks }: SmartLinkListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPaymentFlow, setShowPaymentFlow] = useState<SmartLink | null>(null);

  // Apply filters
  const filteredLinks = initialSmartLinks.filter(link => {
    const matchesSearch = 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || link.status === statusFilter;
    
    const matchesDate = !dateRange || (
      new Date(link.createdAt) >= dateRange.from &&
      new Date(link.createdAt) <= dateRange.to
    );

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Apply sorting and pagination
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = filteredLinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://pay.example.com/${id}`);
    toast.success('Payment link copied to clipboard');
  };

  const handleDelete = (id: string) => {
    const link = initialSmartLinks.find(l => l.id === id);
    if (link?.totalPayments === 0) {
      toast.success('SmartLink deleted successfully');
    } else {
      toast.error('Cannot delete SmartLink with existing payments');
    }
  };

  const handlePreview = (link: SmartLink) => {
    setShowPaymentFlow(link);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SmartLinks..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="disabled">Disabled</option>
        </select>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        >
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date Range</span>
          </button>
        </DateRangePicker>
      </div>

      {/* List */}
      <div className="space-y-4">
        {paginatedLinks.map((link) => (
          <div
            key={link.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === link.id ? null : link.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{link.title}</h3>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    {
                      'bg-emerald-100 text-emerald-800': link.status === 'active',
                      'bg-red-100 text-red-800': link.status === 'expired',
                      'bg-gray-100 text-gray-800': link.status === 'disabled'
                    }
                  )}>
                    {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: link.currency
                    }).format(link.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {link.totalPayments} payments
                  </p>
                </div>
                {expandedId === link.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedId === link.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expires</p>
                    <p className="text-sm font-medium">
                      {new Date(link.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Methods</p>
                    <p className="text-sm font-medium">
                      {link.paymentMethods.map(method => 
                        method.charAt(0).toUpperCase() + method.slice(1)
                      ).join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount Received</p>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: link.currency
                      }).format(link.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCopyLink(link.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => handlePreview(link)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => {/* Edit functionality */}}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  {link.totalPayments === 0 && (
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {paginatedLinks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No SmartLinks found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLinks.length)} of {filteredLinks.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Payment Flow Modal */}
      {showPaymentFlow && (
        <PaymentFlowModal
          link={showPaymentFlow}
          onClose={() => setShowPaymentFlow(null)}
        />
      )}
    </div>
  );
}