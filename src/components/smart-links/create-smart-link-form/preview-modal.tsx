import { X } from 'lucide-react';
import { FormData } from '.';

interface PreviewModalProps {
  data: FormData;
  onClose: () => void;
}

export function PreviewModal({ data, onClose }: PreviewModalProps) {
  const totalAmount = data.type === 'invoice'
    ? data.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
    : Number(data.amount) / 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Payment Preview</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">{data.name}</h2>
              {data.description && (
                <p className="text-gray-500 mb-4">{data.description}</p>
              )}
            </div>

            {data.type === 'invoice' ? (
              <div className="space-y-4">
                {data.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {product.quantity} x {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: data.receivingCurrency
                        }).format(product.price)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: data.receivingCurrency
                      }).format(product.price * product.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: data.receivingCurrency
                  }).format(totalAmount)}
                </p>
              </div>
            )}

            {data.allowInstallments && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Up to {data.maxInstallments}x installments available
                </p>
              </div>
            )}

            <button className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Pay Now
            </button>

            <div className="flex items-center justify-center gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" />
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Pay_Logo.svg" alt="Google Pay" className="h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}