import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteCardDialogProps {
  card: {
    id: string;
    last4: string;
    name: string;
  };
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteCardDialog({ card, onConfirm, onClose }: DeleteCardDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Delete Card</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete this card? This action cannot be undone.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{card.name}</p>
              <p className="text-sm text-gray-500">•••• {card.last4}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Delete Card'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}