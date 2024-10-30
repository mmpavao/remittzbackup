import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { SelectRecipientModal } from '@/components/wallet/select-recipient-modal';

interface Contact {
  id: number;
  name: string;
  avatar: string;
}

export function QuickTransfer() {
  const navigate = useNavigate();
  const [showSelectRecipient, setShowSelectRecipient] = useState(false);
  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 2, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 3, name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
  ]);

  const handleContactClick = (contact: Contact) => {
    // Navigate to wallet with pre-selected recipient
    navigate('/wallet', { 
      state: { 
        openTransfer: true,
        selectedRecipient: {
          id: contact.id.toString(),
          fullName: contact.name,
          avatar: contact.avatar
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Quick Transfer</h2>
      <div className="flex items-center space-x-2 mb-4">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handleContactClick(contact)}
            className="flex-shrink-0 group relative"
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full ring-2 ring-white group-hover:ring-emerald-500 transition-all"
            />
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-900 text-white px-2 py-1 rounded-md whitespace-nowrap">
              {contact.name}
            </span>
          </button>
        ))}
        <button
          onClick={() => setShowSelectRecipient(true)}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showSelectRecipient && (
        <SelectRecipientModal
          onSelect={(recipient) => {
            handleContactClick({
              id: parseInt(recipient.id),
              name: recipient.fullName,
              avatar: recipient.avatar
            });
            setShowSelectRecipient(false);
          }}
          onClose={() => setShowSelectRecipient(false)}
        />
      )}
    </div>
  );
}