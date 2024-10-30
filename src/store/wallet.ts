import { create } from 'zustand';
import { Wallet } from '@/lib/wallet';

interface WalletState {
  selectedWallet: Wallet | null;
  setSelectedWallet: (wallet: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  selectedWallet: null,
  setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),
}));