import { FormData, LinkType } from '.';
import { cn } from '@/lib/utils';

interface BasicInfoFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
}

export function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const handleTypeChange = (type: LinkType) => {
    onChange({
      ...data,
      type,
      products: type === 'invoice' ? [{ id: '1', name: '', price: 0, quantity: 1 }] : []
    });
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.receivingCurrency,
    }).format(Number(number) / 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('simple')}
            className={cn(
              "p-4 border rounded-lg text-center",
              data.type === 'simple'
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-200 hover:border-emerald-200"
            )}
          >
            Simple Link
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('invoice')}
            className={cn(
              "p-4 border rounded-lg text-center",
              data.type === 'invoice'
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-200 hover:border-emerald-200"
            )}
          >
            Invoice
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Enter link name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          rows={3}
          placeholder="Enter description"
        />
      </div>

      {data.type === 'simple' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="text"
            value={data.amount ? formatCurrency(data.amount) : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '');
              onChange({ ...data, amount: value });
            }}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            placeholder={`0.00 ${data.receivingCurrency}`}
          />
        </div>
      )}

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.allowInstallments}
            onChange={(e) => onChange({ ...data, allowInstallments: e.target.checked })}
            className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
          />
          Allow Installments
        </label>

        {data.allowInstallments && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Installments
            </label>
            <select
              value={data.maxInstallments}
              onChange={(e) => onChange({ ...data, maxInstallments: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  Up to {num}x
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}