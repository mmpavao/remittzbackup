import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserRole } from '@/lib/auth';

interface UserData {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt: number;
  isMasterAccount: boolean;
  kycStatus: 'pending' | 'in_progress' | 'completed';
  kycCompletionPercentage: number;
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: number;
  };
  status: 'active' | 'pending' | 'suspended';
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserData: (userData: UserData | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
}));