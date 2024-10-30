import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createReceiver, updateReceiver, processProvisionalTransaction, confirmProvisionalTransaction } from '@/lib/receivers';
import toast from 'react-hot-toast';

export function useReceivers() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivers, setReceivers] = useState<any[]>([]);

  const fetchReceivers = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const receiversRef = collection(db, 'receivers');
      const q = query(receiversRef, where('metadata.createdBy', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const receiversList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.data().fullName)}&background=random&size=128`
      }));
      
      setReceivers(receiversList);
    } catch (err: any) {
      console.error('Error fetching receivers:', err);
      setError(err.message || 'Failed to fetch receivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivers();
  }, [user?.uid]);

  const addReceiver = async (data: {
    fullName: string;
    email: string;
    phone?: string;
  }) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      const receiver = await createReceiver({
        ...data,
        metadata: {
          createdBy: user.uid,
          timestamp: Date.now()
        }
      });
      
      await fetchReceivers(); // Refresh the list
      toast.success('Receiver added successfully');
      return receiver;
    } catch (err: any) {
      console.error('Error adding receiver:', err);
      toast.error(err.message || 'Failed to add receiver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReceiverDetails = async (receiverId: string, data: any) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      await updateReceiver(receiverId, data);
      await fetchReceivers(); // Refresh the list
      toast.success('Receiver updated successfully');
    } catch (err: any) {
      console.error('Error updating receiver:', err);
      toast.error(err.message || 'Failed to update receiver');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processTransaction = async (
    receiverId: string,
    type: 'credit' | 'debit',
    amount: number
  ) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      const transactionId = await processProvisionalTransaction(
        receiverId,
        type,
        amount
      );
      
      toast.success(`${type === 'credit' ? 'Payment' : 'Request'} processed successfully`);
      return transactionId;
    } catch (err: any) {
      console.error('Transaction failed:', err);
      toast.error(err.message || 'Failed to process transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmTransaction = async (receiverId: string, transactionId: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      await confirmProvisionalTransaction(receiverId, transactionId);
      toast.success('Transaction confirmed successfully');
    } catch (err: any) {
      console.error('Failed to confirm transaction:', err);
      toast.error(err.message || 'Failed to confirm transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    receivers,
    addReceiver,
    updateReceiverDetails,
    processTransaction,
    confirmTransaction,
    refreshReceivers: fetchReceivers
  };
}