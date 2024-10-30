import { useState } from 'react';
import { Plus, Zap, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  icon: typeof Zap;
  name: string;
  dueDate: string;
  amount: number;
}

export function MonthlyPayments() {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      icon: Zap,
      name: 'Electricity',
      dueDate: '15 July',
      amount: 20.30
    },
    {
      id: '2',
      icon: Wifi,
      name: 'Internet',
      dueDate: '15 July',
      amount: 45.00
    }
  ]);

  const handlePayNow = (payment: Payment) => {
    toast.success(`Processing payment for ${payment.name}`);
  };

  const handleAddPayment = () => {
    toast.success('Add payment feature coming soon!');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Monthly Payments</h2>
        <button
          onClick={handleAddPayment}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <payment.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">{payment.name}</h3>
                <p className="text-sm text-gray-500">Pay before {payment.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">${payment.amount.toFixed(2)}</p>
              <button
                onClick={() => handlePayNow(payment)}
                className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Pay now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}