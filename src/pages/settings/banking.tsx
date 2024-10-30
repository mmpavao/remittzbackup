import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Building, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
}

export function Banking() {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountType: 'checking',
      accountNumber: '****4567',
      routingNumber: '****8901',
      isDefault: true,
    }
  ]);

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountType: 'checking' as const,
    accountNumber: '',
    routingNumber: '',
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account: BankAccount = {
      id: Date.now().toString(),
      ...newAccount,
      isDefault: accounts.length === 0,
    };
    setAccounts([...accounts, account]);
    setIsAddingAccount(false);
    setNewAccount({
      bankName: '',
      accountType: 'checking',
      accountNumber: '',
      routingNumber: '',
    });
    toast.success('Bank account added successfully');
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success('Bank account removed successfully');
  };

  const handleSetDefault = (id: string) => {
    setAccounts(accounts.map(account => ({
      ...account,
      isDefault: account.id === id,
    })));
    toast.success('Default account updated');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banking Information"
        subtitle="Manage your bank accounts for payments and withdrawals"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings/general' },
          { label: 'Banking' }
        ]}
      />

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Bank Accounts</h2>
            <button
              onClick={() => setIsAddingAccount(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bank accounts</h3>
              <p className="text-gray-500 mb-4">Add your first bank account to start receiving payments</p>
              <button
                onClick={() => setIsAddingAccount(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {account.bankName}
                      </h3>
                      {account.isDefault && (
                        <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isDefault && (
                      <button
                        onClick={() => handleSetDefault(account.id)}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveAccount(account.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAddingAccount && (
            <div className="mt-6 p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Bank Account</h3>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={newAccount.bankName}
                      onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <select
                      value={newAccount.accountType}
                      onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value as 'checking' | 'savings' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    required
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                  <input
                    type="text"
                    required
                    value={newAccount.routingNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, routingNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingAccount(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}