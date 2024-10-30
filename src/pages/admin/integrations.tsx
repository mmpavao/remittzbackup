import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: 'payment' | 'communication' | 'crm' | 'ai';
  status: 'connected' | 'disconnected';
  popular?: boolean;
}

const integrations: Integration[] = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Accept payments through Mercado Pago platform',
    logo: 'https://logospng.org/download/mercado-pago/logo-mercado-pago-icon-1024.png',
    category: 'payment',
    status: 'disconnected',
    popular: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments with Stripe payment gateway',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.png',
    category: 'payment',
    status: 'connected',
    popular: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Accept PayPal payments worldwide',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    category: 'payment',
    status: 'disconnected',
    popular: true
  }
];

export function AdminIntegrations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || integration.category === categoryFilter;
    const matchesStatus = !statusFilter || integration.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'connected') {
      toast.success(`Successfully disconnected from ${integration.name}`);
    } else {
      toast.success(`Successfully connected to ${integration.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="Connect your platform with third-party services"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Integrations' }
        ]}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search integrations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Categories</option>
          <option value="payment">Payment</option>
          <option value="communication">Communication</option>
          <option value="crm">CRM</option>
          <option value="ai">AI</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="connected">Connected</option>
          <option value="disconnected">Disconnected</option>
        </select>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    integration.status === 'connected'
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-800"
                  )}>
                    {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleConnect(integration)}
                className="p-2 text-gray-400 hover:text-emerald-500 rounded-full hover:bg-gray-100"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">{integration.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}