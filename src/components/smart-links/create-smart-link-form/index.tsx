import { useState } from 'react';
import { X } from 'lucide-react';
import { BasicInfoForm } from './basic-info-form';
import { InvoiceForm } from './invoice-form';
import { PreviewModal } from './preview-modal';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreateSmartLinkFormProps {
  onClose: () => void;
}

export type LinkType = 'simple' | 'invoice';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'boleto' | 'wire_transfer';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface FormData {
  type: LinkType;
  name: string;
  description?: string;
  amount: string;
  products: Product[];
  receivingCurrency: string;
  allowInstallments: boolean;
  maxInstallments: number;
}

const initialFormData: FormData = {
  type: 'simple',
  name: '',
  description: '',
  amount: '',
  products: [],
  receivingCurrency: 'USD',
  allowInstallments: false,
  maxInstallments: 12
};

export function CreateSmartLinkForm({ onClose }: CreateSmartLinkFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would make an API call to create the smart link
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Smart link created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create smart link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Create Smart Link</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('form')}
              className={cn(
                "px-4 py-2 rounded-lg",
                activeTab === 'form'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Form
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                "px-4 py-2 rounded-lg",
                activeTab === 'preview'
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Preview
            </button>
          </div>

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.type === 'simple' ? (
                <BasicInfoForm
                  data={formData}
                  onChange={setFormData}
                />
              ) : (
                <InvoiceForm
                  data={formData}
                  onChange={setFormData}
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Create Link
                </button>
              </div>
            </form>
          ) : (
            <PreviewModal
              data={formData}
              onClose={() => setActiveTab('form')}
            />
          )}
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          data={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}