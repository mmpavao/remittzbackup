import { UserRole } from './auth';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PAYMENTS: 'manage_payments',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_API_KEYS: 'manage_api_keys',
} as const;

export const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: [
    { id: PERMISSIONS.MANAGE_USERS, name: 'Manage Users', description: 'Create, edit, and delete users' },
    { id: PERMISSIONS.MANAGE_ROLES, name: 'Manage Roles', description: 'Assign and manage user roles' },
    { id: PERMISSIONS.MANAGE_PAYMENTS, name: 'Manage Payments', description: 'Process and manage payments' },
    { id: PERMISSIONS.VIEW_ANALYTICS, name: 'View Analytics', description: 'Access analytics and reports' },
    { id: PERMISSIONS.MANAGE_SETTINGS, name: 'Manage Settings', description: 'Configure platform settings' },
    { id: PERMISSIONS.MANAGE_API_KEYS, name: 'Manage API Keys', description: 'Create and manage API keys' },
  ],
  admin: [
    { id: PERMISSIONS.MANAGE_USERS, name: 'Manage Users', description: 'Create, edit, and delete users' },
    { id: PERMISSIONS.MANAGE_PAYMENTS, name: 'Manage Payments', description: 'Process and manage payments' },
    { id: PERMISSIONS.VIEW_ANALYTICS, name: 'View Analytics', description: 'Access analytics and reports' },
  ],
  user: [],
};

export function hasPermission(userRole: UserRole | undefined, permission: string): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole].some(p => p.id === permission);
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function getAllPermissions(): Permission[] {
  return Object.values(ROLE_PERMISSIONS).flat();
}