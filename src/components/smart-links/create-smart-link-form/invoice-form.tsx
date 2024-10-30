import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { FormData, Product } from '.';
import { cn } from '@/lib/utils';

interface InvoiceFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
}

export function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null);

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const newProducts = [...data.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value
    };
    onChange({ ...data, products: newProducts });
  };

  const handleAddProduct = () => {
    onChange({
      ...data,
      products: [
        ...data.products,
        {
          id: Date.now().toString(),
          name: '',
          price: 0,
          quantity: 1
        }
      ]
    });
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...data.products];
    newProducts.splice(index, 1);
    onChange({ ...data, products: newProducts });
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleProductChange(index, 'image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (productId: string) => {
    setDraggedProduct(productId);
  };

  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault();
    if (draggedProduct && draggedProduct !== productId) {
      const dragIndex = data.products.findIndex(p => p.id === draggedProduct);
      const hoverIndex = data.products.findIndex(p => p.id === productId);
      
      const newProducts = [...data.products];
      const draggedItem = newProducts[dragIndex];
      newProducts.splice(dragIndex, 1);
      newProducts.splice(hoverIndex, 0, draggedItem);
      
      onChange({ ...data, products: newProducts });
    }
  };

  const totalAmount = data.products.reduce(
    (sum, product) => sum + (product.price * product.quantity),
    0
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.products.map((product, index) => (
          <div
            key={product.id}
            draggable
            onDragStart={() => handleDragStart(product.id)}
            onDragOver={(e) => handleDragOver(e, product.id)}
            onDragEnd={() => setDraggedProduct(null)}
            className={cn(
              "p-4 border border-gray-200 rounded-lg",
              draggedProduct === product.id && "opacity-50"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    placeholder="Product name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    value={product.price || ''}
                    onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                    placeholder="Price"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-2 text-right text-sm text-gray-500">
              Subtotal: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: data.receivingCurrency
              }).format(product.price * product.quantity)}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddProduct}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount:</span>
          <span className="text-lg font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: data.receivingCurrency
            }).format(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}