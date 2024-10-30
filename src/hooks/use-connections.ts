import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createConnection, updateConnection, deleteConnection, Connection, addTestConnections } from '@/lib/connections';
import toast from 'react-hot-toast';

export function useConnections() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const fetchConnections = async () => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const connectionsRef = collection(db, 'connections');
      const q = query(
        connectionsRef, 
        where('metadata.createdBy', '==', user.uid),
        where('status', 'in', ['active', 'pending'])
      );
      const snapshot = await getDocs(q);
      
      const connectionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastModified: doc.data().lastModified?.toDate(),
        lastTransaction: doc.data().lastTransaction?.toDate(),
      })) as Connection[];
      
      setConnections(connectionsList);
      setError(null);

      // If no connections exist, add test data
      if (connectionsList.length === 0) {
        await addTestConnections(user.uid);
        await fetchConnections(); // Refresh the list
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch connections';
      console.error('Error fetching connections:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user?.uid]);

  const addConnection = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    bankAccounts: any[];
  }) => {
    if (!user?.uid) {
      const error = 'You must be logged in to add connections';
      setError(error);
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      // Validate required fields
      if (!data.fullName?.trim()) {
        throw new Error('Full name is required');
      }
      if (!data.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!data.bankAccounts?.length) {
        throw new Error('At least one bank account is required');
      }

      const connection = await createConnection({
        ...data,
        metadata: {
          createdBy: user.uid,
          timestamp: Date.now()
        }
      });
      
      // Update local state with the new connection
      setConnections(prev => [...prev, connection]);
      toast.success('Connection added successfully');

      // Refresh the connections list to ensure we have the latest data
      await fetchConnections();
      
      return connection;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add connection';
      console.error('Error adding connection:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConnectionDetails = async (connectionId: string, data: Partial<Connection>) => {
    if (!user?.uid) {
      const error = 'You must be logged in to update connections';
      setError(error);
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      await updateConnection(connectionId, data);
      
      // Update local state
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId ? { ...conn, ...data } : conn
      ));
      
      toast.success('Connection updated successfully');
      
      // Refresh the connections list
      await fetchConnections();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update connection';
      console.error('Error updating connection:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!user?.uid) {
      const error = 'You must be logged in to remove connections';
      setError(error);
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      await deleteConnection(connectionId);
      
      // Update local state
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      toast.success('Connection removed successfully');
      
      // Refresh the connections list
      await fetchConnections();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove connection';
      console.error('Error removing connection:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    connections,
    addConnection,
    updateConnectionDetails,
    removeConnection,
    refreshConnections: fetchConnections
  };
}