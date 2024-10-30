import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Search, Plus, Trash2, Mail, Phone } from 'lucide-react';
import { AddConnectionForm } from '@/components/connections/add-connection-form';
import { InviteForm } from '@/components/connections/invite-form';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Connection {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  status: 'active' | 'pending' | 'blocked';
  lastTransaction?: string;
  bankAccounts: {
    [key: string]: {
      bankName: string;
      accountNumber: string;
      routingNumber?: string; // USD
      agencia?: string; // BRL
      swift?: string; // EUR
      iban?: string; // EUR
    };
  };
}

export function Connections() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 890',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      status: 'active',
      lastTransaction: '2024-03-15',
      bankAccounts: {
        USD: {
          bankName: 'Chase Bank',
          accountNumber: '****4567',
          routingNumber: '****8901'
        }
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      status: 'active',
      lastTransaction: '2024-03-14',
      bankAccounts: {
        EUR: {
          bankName: 'Deutsche Bank',
          accountNumber: '****7890',
          swift: 'DEUTDEFF',
          iban: 'DE89****4567'
        }
      }
    },
    {
      id: '3',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 345 678 901',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      status: 'pending',
      bankAccounts: {
        BRL: {
          bankName: 'Itaú',
          accountNumber: '****5678',
          agencia: '****'
        }
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState<'email' | 'phone' | null>(null);

  const handleAddConnection = async (data: any) => {
    const newConnection: Connection = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&size=128`,
      status: 'pending',
      bankAccounts: data.bankAccounts.reduce((acc: any, account: any) => {
        acc[account.currency] = {
          bankName: account.bankName,
          accountNumber: account.accountNumber,
          ...(account.routingNumber && { routingNumber: account.routingNumber }),
          ...(account.agencia && { agencia: account.agencia }),
          ...(account.swift && { swift: account.swift }),
          ...(account.iban && { iban: account.iban }),
        };
        return acc;
      }, {})
    };

    setConnections([...connections, newConnection]);
  };

  const handleRemoveConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
    toast.success('Connection removed successfully');
  };

  const handleInvite = async (data: { type: 'email' | 'phone'; value: string }) => {
    // In a real app, you would make an API call here
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Invitation sent via ${data.type}`);
  };

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        subtitle="Manage your payment connections"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Connections' }
        ]}
      />

      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search connections..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInviteForm('email')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email Invite
          </button>
          <button
            onClick={() => setShowInviteForm('phone')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Phone Invite
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Connection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConnections.map((connection) => (
          <div
            key={connection.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={connection.avatar}
                  alt={connection.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{connection.name}</h3>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    {
                      'bg-emerald-100 text-emerald-800': connection.status === 'active',
                      'bg-yellow-100 text-yellow-800': connection.status === 'pending',
                      'bg-red-100 text-red-800': connection.status === 'blocked'
                    }
                  )}>
                    {connection.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveConnection(connection.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <p>{connection.email}</p>
              {connection.phone && <p>{connection.phone}</p>}
              {connection.lastTransaction && (
                <p>Last transaction: {new Date(connection.lastTransaction).toLocaleDateString()}</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bank Accounts</h4>
              <div className="space-y-2">
                {Object.entries(connection.bankAccounts).map(([currency, account]) => (
                  <div key={currency} className="text-sm">
                    <p className="font-medium">{currency}</p>
                    <p className="text-gray-500">{account.bankName}</p>
                    <p className="text-gray-500">Account: {account.accountNumber}</p>
                    {account.routingNumber && (
                      <p className="text-gray-500">Routing: {account.routingNumber}</p>
                    )}
                    {account.agencia && (
                      <p className="text-gray-500">Agência: {account.agencia}</p>
                    )}
                    {account.swift && (
                      <p className="text-gray-500">SWIFT/BIC: {account.swift}</p>
                    )}
                    {account.iban && (
                      <p className="text-gray-500">IBAN: {account.iban}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddConnectionForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddConnection}
        />
      )}

      {showInviteForm && (
        <InviteForm
          type={showInviteForm}
          onClose={() => setShowInviteForm(null)}
          onSubmit={handleInvite}
        />
      )}
    </div>
  );
}