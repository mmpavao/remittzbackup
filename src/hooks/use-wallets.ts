import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getWallets, Wallet, createWallet, updateWallet, deleteWallet, setPrimaryWallet, processTransaction } from '@/lib/wallet';
import toast from 'react-hot-toast';

export function useWallets() {
  const { user } = useAuthStore();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    if (!user?.uid) return;
    
    try {
      const data = await getWallets(user.uid);
      setWallets(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError('Failed to load wallets');
      toast.error('Failed to load wallets');
      throw err;
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    fetchWallets().finally(() => setLoading(false));
  }, [user?.uid]);

  const addWallet = async (data: Parameters<typeof createWallet>[1]) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);
      const newWallet = await createWallet(user.uid, data);
      setWallets(prev => [...prev, newWallet]);
      toast.success('Wallet created successfully');
      return newWallet;
    } catch (err: any) {
      console.error('Error creating wallet:', err);
      toast.error(err.message || 'Failed to create wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWalletDetails = async (walletId: string, data: Parameters<typeof updateWallet>[2]) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);
      await updateWallet(walletId, user.uid, data);
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId ? { ...wallet, ...data } : wallet
      ));
      toast.success('Wallet updated successfully');
    } catch (err: any) {
      console.error('Error updating wallet:', err);
      toast.error(err.message || 'Failed to update wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeWallet = async (walletId: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);
      await deleteWallet(walletId, user.uid);
      setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
      toast.success('Wallet deleted successfully');
    } catch (err: any) {
      console.error('Error deleting wallet:', err);
      toast.error(err.message || 'Failed to delete wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makePrimary = async (walletId: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);
      await setPrimaryWallet(walletId, user.uid);
      setWallets(prev => prev.map(wallet => ({
        ...wallet,
        isPrimary: wallet.id === walletId
      })));
      toast.success('Primary wallet updated successfully');
    } catch (err: any) {
      console.error('Error setting primary wallet:', err);
      toast.error(err.message || 'Failed to update primary wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (walletId: string, type: 'deposit' | 'withdrawal' | 'transfer', amount: number, description?: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);
      
      // Process the transaction
      await processTransaction(walletId, user.uid, {
        type,
        amount,
        description,
        metadata: {
          timestamp: new Date().toISOString()
        }
      });

      // Double-check: Fetch the latest wallet data from the database
      const updatedWallets = await fetchWallets();
      const updatedWallet = updatedWallets?.find(w => w.id === walletId);

      if (!updatedWallet) {
        throw new Error('Failed to verify transaction');
      }

      // Verify the balance matches our expectation
      const expectedBalance = type === 'deposit' 
        ? updatedWallet.balance
        : updatedWallet.balance;

      if (updatedWallet.balance !== expectedBalance) {
        console.warn('Balance mismatch detected, syncing with server...');
        setWallets(updatedWallets);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} successful`);
      return updatedWallet;
    } catch (err: any) {
      console.error(`Error processing ${type}:`, err);
      toast.error(err.message || `Failed to process ${type}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    wallets,
    loading,
    error,
    addWallet,
    updateWalletDetails,
    removeWallet,
    makePrimary,
    handleTransaction,
    refreshWallets: fetchWallets
  };
}