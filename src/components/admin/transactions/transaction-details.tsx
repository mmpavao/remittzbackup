import { useState } from 'react';
import { X, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionDetailsProps {
  transaction: any;
  onClose: () => void;
  onEdit: (transactionId: string, updates: any) => Promise<void>;
  onDelete: (transactionId: string) => Promise<void>;
}

export function TransactionDetails({
  transaction,
  onClose,
  onEdit,
  onDelete
}: TransactionDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedData, setEditedData] = useState({
    status: transaction.status,
    description: transaction.description
  });

  const handleSave = async () => {
    await onEdit(transaction.id, editedData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(transaction.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Transaction ID and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="mt-1 text-sm font-mono">{transaction.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date</label>
                <p className="mt-1 text-sm">
                  {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Amount and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Amount</label>
                <p className="mt-1 text-lg font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: transaction.currency
                  }).format(transaction.amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                {isEditing ? (
                  <select
                    value={editedData.status}
                    onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="disputed">Disputed</option>
                  </select>
                ) : (
                  <span className={cn(
                    "mt-1 inline-flex px-2 py-1 text-sm font-medium rounded-full",
                    {
                      'bg-emerald-100 text-emerald-800': transaction.status === 'completed',
                      'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                      'bg-red-100 text-red-800': transaction.status === 'failed',
                      'bg-orange-100 text-orange-800': transaction.status === 'disputed'
                    }
                  )}>
                    {transaction.status}
                  </span>
                )}
              </div>
            </div>

            {/* Sender and Recipient */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">From</label>
                <div className="mt-1">
                  <p className="text-sm font-medium">{transaction.sender.name}</p>
                  <p className="text-sm text-gray-500">{transaction.sender.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">To</label>
                <div className="mt-1">
                  <p className="text-sm font-medium">{transaction.recipient.name}</p>
                  <p className="text-sm text-gray-500">{transaction.recipient.email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              {isEditing ? (
                <textarea
                  value={editedData.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              ) : (
                <p className="mt-1 text-sm">{transaction.description}</p>
              )}
            </div>

            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium text-gray-500">Additional Details</label>
              <div className="mt-1 bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {!showDeleteConfirm && (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}

              {showDeleteConfirm && (
                <div className="flex items-center gap-4 bg-red-50 px-4 py-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-600">Delete this transaction?</p>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}

              {isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}