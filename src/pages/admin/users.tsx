import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Search, Filter, MoreVertical, UserPlus } from 'lucide-react';
import { UserForm } from '@/components/users/user-form';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { useAuthStore } from '@/store/auth';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-15T10:30:00',
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-03-14T15:45:00',
    createdAt: '2024-01-15T00:00:00'
  },
  {
    id: '3',
    fullName: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'pending',
    lastLogin: '2024-03-10T09:20:00',
    createdAt: '2024-02-01T00:00:00'
  }
];

export function AdminUsers() {
  const { userData } = useAuthStore();
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canManageUsers = hasPermission(userData?.role, PERMISSIONS.MANAGE_USERS);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (data: any) => {
    // In a real app, make API call here
    console.log('Create user:', data);
    toast.success('User created successfully');
  };

  const handleUpdateUser = async (data: any) => {
    // In a real app, make API call here
    console.log('Update user:', data);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    // In a real app, make API call here
    console.log('Delete user:', selectedUser.id);
    toast.success('User deleted successfully');
  };

  const columns = [
    {
      key: 'fullName',
      title: 'User',
      render: (value: string, user: User) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 font-medium">
              {user.fullName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (value: string) => (
        <span className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          value === 'admin' 
            ? "bg-purple-100 text-purple-800"
            : "bg-gray-100 text-gray-800"
        )}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          {
            'bg-emerald-100 text-emerald-800': value === 'active',
            'bg-yellow-100 text-yellow-800': value === 'pending',
            'bg-red-100 text-red-800': value === 'suspended'
          }
        )}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: '',
      render: (_: any, user: User) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
              setShowUserForm(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts and permissions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Users' }
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
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>

        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Filter className="w-5 h-5 text-gray-500" />
        </button>

        {canManageUsers && (
          <button 
            onClick={() => {
              setSelectedUser(null);
              setShowUserForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ResponsiveTable
          data={filteredUsers}
          columns={columns}
          onRowClick={(user) => {
            if (canManageUsers) {
              setSelectedUser(user);
              setShowUserForm(true);
            }
          }}
        />
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={selectedUser || undefined}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onClose={() => {
            setSelectedUser(null);
            setShowUserForm(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedUser && (
        <DeleteUserDialog
          user={selectedUser}
          onConfirm={handleDeleteUser}
          onClose={() => {
            setSelectedUser(null);
            setShowDeleteDialog(false);
          }}
        />
      )}
    </div>
  );
}