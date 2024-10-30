import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole } from '@/lib/auth';
import { getRolePermissions } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['user', 'admin', 'super_admin'] as const),
  status: z.enum(['active', 'pending', 'suspended'] as const),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: 'active' | 'pending' | 'suspended';
  };
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

export function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    } : {
      role: 'user',
      status: 'pending',
    },
  });

  const selectedRole = watch('role') as UserRole;
  const permissions = getRolePermissions(selectedRole);

  const handleFormSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(user ? 'User updated successfully' : 'User created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {user ? 'Edit User' : 'Create User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.email && "border-red-300"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('fullName')}
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
                  errors.fullName && "border-red-300"
                )}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                {...register('role')}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                {showPermissions ? 'Hide' : 'Show'} Role Permissions
              </button>

              {showPermissions && permissions.length > 0 && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Permissions for {selectedRole}:
                  </h4>
                  <ul className="space-y-2">
                    {permissions.map((permission) => (
                      <li key={permission.id} className="text-sm text-gray-600">
                        • {permission.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  user ? 'Save Changes' : 'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}