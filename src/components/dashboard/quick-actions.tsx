import { Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export function QuickActions() {
  const handleSendMoney = () => {
    toast.success('Send money feature coming soon!');
  };

  const handleReceiveMoney = () => {
    toast.success('Receive money feature coming soon!');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSendMoney}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Send className="w-6 h-6 text-emerald-600 mb-2" />
          <span className="text-sm font-medium">Send</span>
        </button>
        <button
          onClick={handleReceiveMoney}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Download className="w-6 h-6 text-emerald-600 mb-2" />
          <span className="text-sm font-medium">Receive</span>
        </button>
      </div>
    </div>
  );
}