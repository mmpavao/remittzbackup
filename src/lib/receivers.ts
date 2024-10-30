import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { logAuditEvent } from './audit';

export interface Receiver {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'provisional' | 'pending';
  createdAt: Date;
  lastModified: Date;
  provisionalWallet?: {
    balance: number;
    currency: string;
    pendingTransactions: Array<{
      id: string;
      type: 'credit' | 'debit';
      amount: number;
      expiresAt: Date;
      status: 'pending' | 'completed' | 'cancelled';
    }>;
  };
  metadata?: Record<string, any>;
}

export async function createReceiver(data: Omit<Receiver, 'id' | 'createdAt' | 'lastModified' | 'status'>) {
  try {
    // Check if receiver already exists
    const existingQuery = query(
      collection(db, 'receivers'),
      where('email', '==', data.email)
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      throw new Error('A receiver with this email already exists');
    }

    const receiverData = {
      ...data,
      status: 'provisional',
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      provisionalWallet: {
        balance: 0,
        currency: 'USD',
        pendingTransactions: []
      }
    };

    const docRef = await addDoc(collection(db, 'receivers'), receiverData);

    await logAuditEvent({
      action: 'receiver_created',
      targetId: docRef.id,
      details: `Created provisional receiver: ${data.email}`
    });

    return {
      id: docRef.id,
      ...receiverData,
      createdAt: new Date(),
      lastModified: new Date()
    };
  } catch (error: any) {
    console.error('Failed to create receiver:', error);
    throw new Error(error.message || 'Failed to create receiver');
  }
}

export async function updateReceiver(id: string, updates: Partial<Receiver>) {
  try {
    const receiverRef = doc(db, 'receivers', id);
    const receiverDoc = await getDoc(receiverRef);

    if (!receiverDoc.exists()) {
      throw new Error('Receiver not found');
    }

    await updateDoc(receiverRef, {
      ...updates,
      lastModified: serverTimestamp()
    });

    await logAuditEvent({
      action: 'receiver_updated',
      targetId: id,
      details: `Updated receiver: ${receiverDoc.data().email}`
    });

    return true;
  } catch (error: any) {
    console.error('Failed to update receiver:', error);
    throw new Error(error.message || 'Failed to update receiver');
  }
}

export async function processProvisionalTransaction(
  receiverId: string,
  type: 'credit' | 'debit',
  amount: number,
  expiryHours = 48
) {
  try {
    const receiverRef = doc(db, 'receivers', receiverId);
    const receiverDoc = await getDoc(receiverRef);

    if (!receiverDoc.exists()) {
      throw new Error('Receiver not found');
    }

    const receiver = receiverDoc.data() as Receiver;
    
    if (!receiver.provisionalWallet) {
      throw new Error('No provisional wallet found');
    }

    const transactionId = `tx_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    const newTransaction = {
      id: transactionId,
      type,
      amount,
      expiresAt,
      status: 'pending'
    };

    const updatedWallet = {
      ...receiver.provisionalWallet,
      pendingTransactions: [
        ...receiver.provisionalWallet.pendingTransactions,
        newTransaction
      ]
    };

    await updateDoc(receiverRef, {
      provisionalWallet: updatedWallet,
      lastModified: serverTimestamp()
    });

    await logAuditEvent({
      action: `provisional_${type}`,
      targetId: receiverId,
      details: `Processed provisional ${type} of ${amount}`,
      metadata: { transactionId }
    });

    return transactionId;
  } catch (error: any) {
    console.error('Failed to process provisional transaction:', error);
    throw new Error(error.message || 'Failed to process transaction');
  }
}

export async function confirmProvisionalTransaction(receiverId: string, transactionId: string) {
  try {
    const receiverRef = doc(db, 'receivers', receiverId);
    const receiverDoc = await getDoc(receiverRef);

    if (!receiverDoc.exists()) {
      throw new Error('Receiver not found');
    }

    const receiver = receiverDoc.data() as Receiver;
    
    if (!receiver.provisionalWallet) {
      throw new Error('No provisional wallet found');
    }

    const transaction = receiver.provisionalWallet.pendingTransactions
      .find(tx => tx.id === transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction is no longer pending');
    }

    if (new Date(transaction.expiresAt) < new Date()) {
      throw new Error('Transaction has expired');
    }

    const updatedTransactions = receiver.provisionalWallet.pendingTransactions
      .map(tx => tx.id === transactionId ? { ...tx, status: 'completed' } : tx);

    const newBalance = transaction.type === 'credit'
      ? receiver.provisionalWallet.balance + transaction.amount
      : receiver.provisionalWallet.balance - transaction.amount;

    await updateDoc(receiverRef, {
      'provisionalWallet.balance': newBalance,
      'provisionalWallet.pendingTransactions': updatedTransactions,
      lastModified: serverTimestamp()
    });

    await logAuditEvent({
      action: 'transaction_confirmed',
      targetId: receiverId,
      details: `Confirmed ${transaction.type} of ${transaction.amount}`,
      metadata: { transactionId }
    });

    return true;
  } catch (error: any) {
    console.error('Failed to confirm transaction:', error);
    throw new Error(error.message || 'Failed to confirm transaction');
  }
}

export async function cleanupExpiredTransactions(receiverId: string) {
  try {
    const receiverRef = doc(db, 'receivers', receiverId);
    const receiverDoc = await getDoc(receiverRef);

    if (!receiverDoc.exists()) {
      throw new Error('Receiver not found');
    }

    const receiver = receiverDoc.data() as Receiver;
    
    if (!receiver.provisionalWallet) {
      return;
    }

    const now = new Date();
    const updatedTransactions = receiver.provisionalWallet.pendingTransactions
      .map(tx => {
        if (tx.status === 'pending' && new Date(tx.expiresAt) < now) {
          return { ...tx, status: 'cancelled' };
        }
        return tx;
      });

    await updateDoc(receiverRef, {
      'provisionalWallet.pendingTransactions': updatedTransactions,
      lastModified: serverTimestamp()
    });

    await logAuditEvent({
      action: 'expired_transactions_cleanup',
      targetId: receiverId,
      details: 'Cleaned up expired transactions'
    });

    return true;
  } catch (error: any) {
    console.error('Failed to cleanup transactions:', error);
    throw new Error(error.message || 'Failed to cleanup transactions');
  }
}