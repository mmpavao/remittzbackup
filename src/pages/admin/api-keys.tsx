import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Key, Copy, Eye, EyeOff, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
  permissions: string[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_123456789abcdef',
    createdAt: '2024-03-01T00:00:00',
    lastUsed: '2024-03-15T10:30:00',
    status: 'active',
    permissions: ['read', 'write']
  },
  {
    id: '2',
    name: 'Test API Key',
    key: 'sk_test_987654321fedcba',
    createdAt: '2024-03-10T00:00:00',
    lastUsed: '2024-03-14T15:45:00',
    status: 'active',
    permissions: ['read']
  }
];

export function AdminApiKeys() {
  const [apiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleRevokeKey = (id: string) => {
    toast.success('API key revoked successfully');
  };

  const handleCreateKey = () => {
    toast.success('Create API key feature coming soon!');
  };

  const formatKey = (key: string) => {
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        subtitle="Manage API keys for accessing your account programmatically"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'API Keys' }
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your API Keys</h2>
            <p className="text-sm text-gray-500">
              Use these keys to authenticate your API requests
            </p>
          </div>
          <button
            onClick={handleCreateKey}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Key
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      apiKey.status === 'active'
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {apiKey.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    <code className="text-sm bg-gray-50 px-2 py-1 rounded">
                      {showKey[apiKey.id] ? apiKey.key : formatKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showKey[apiKey.id] ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeKey(apiKey.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Revoke
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p>Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>Last Used</p>
                  <p className="font-medium text-gray-900">
                    {apiKey.lastUsed
                      ? new Date(apiKey.lastUsed).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Permissions</p>
                <div className="flex gap-2">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}