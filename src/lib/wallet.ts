import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, runTransaction, Timestamp } from 'firebase/firestore';
import { logAuditEvent } from './audit';
import { detectFraud } from './fraud-detection';
import { performSecurityCheck } from './security';

export interface Wallet {
  id: string;
  userId: string;
  country: string;
  countryCode: string;
  currency: string;
  balance: number;
  isPrimary: boolean;
  status: 'active' | 'blocked' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    routingNumber?: string;  // For USD
    agencia?: string;        // For BRL
    swift?: string;          // For EUR
    iban?: string;          // For EUR
  };
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description?: string;
  metadata?: Record<string, any>;
  timestamp: Timestamp;
}

export interface CreateWalletData {
  country: string;
  countryCode: string;
  currency: string;
  bankAccount?: Wallet['bankAccount'];
}

export interface UpdateWalletData {
  bankAccount?: Wallet['bankAccount'];
  status?: Wallet['status'];
}

export interface TransactionData {
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  description?: string;
  metadata?: Record<string, any>;
}

const MAX_WALLETS_PER_CURRENCY = 1;
const MIN_TRANSACTION_AMOUNT = 0.01;
const MAX_TRANSACTION_AMOUNT = 1000000;

export async function getWallets(userId: string): Promise<Wallet[]> {
  try {
    const walletsRef = collection(db, 'wallets');
    const q = query(walletsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Wallet[];
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw new Error('Failed to fetch wallets');
  }
}

export async function createWallet(userId: string, data: CreateWalletData): Promise<Wallet> {
  try {
    const existingWallets = await getWallets(userId);
    const hasCurrencyWallet = existingWallets.some(w => w.currency === data.currency);
    
    if (hasCurrencyWallet) {
      throw new Error(`You already have a ${data.currency} wallet`);
    }

    const isPrimary = existingWallets.length === 0;
    const timestamp = serverTimestamp();

    const walletData = {
      userId,
      ...data,
      balance: 0,
      isPrimary,
      status: 'active' as const,
      createdAt: timestamp,
      updatedAt: timestamp,
      transactions: []
    };

    const walletsRef = collection(db, 'wallets');
    const docRef = await addDoc(walletsRef, walletData);

    await logAuditEvent({
      action: 'wallet_created',
      targetId: docRef.id,
      userId,
      details: `Created ${data.currency} wallet`
    });

    const newWallet = {
      id: docRef.id,
      ...walletData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return newWallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

export async function updateWallet(walletId: string, userId: string, data: UpdateWalletData): Promise<void> {
  try {
    const walletRef = doc(db, 'wallets', walletId);
    const walletDoc = await getDoc(walletRef);
    
    if (!walletDoc.exists()) {
      throw new Error('Wallet not found');
    }

    if (walletDoc.data().userId !== userId) {
      throw new Error('Unauthorized');
    }

    await updateDoc(walletRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    await logAuditEvent({
      action: 'wallet_updated',
      targetId: walletId,
      userId,
      details: 'Updated wallet details'
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
}

export async function deleteWallet(walletId: string, userId: string): Promise<void> {
  try {
    const walletRef = doc(db, 'wallets', walletId);
    const walletDoc = await getDoc(walletRef);
    
    if (!walletDoc.exists()) {
      throw new Error('Wallet not found');
    }

    if (walletDoc.data().userId !== userId) {
      throw new Error('Unauthorized');
    }

    const wallet = walletDoc.data() as Wallet;
    
    if (wallet.balance > 0) {
      throw new Error('Cannot delete wallet with existing balance');
    }

    if (wallet.isPrimary) {
      throw new Error('Cannot delete primary wallet');
    }

    await deleteDoc(walletRef);

    await logAuditEvent({
      action: 'wallet_deleted',
      targetId: walletId,
      userId,
      details: `Deleted ${wallet.currency} wallet`
    });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}

export async function setPrimaryWallet(walletId: string, userId: string): Promise<void> {
  try {
    const wallets = await getWallets(userId);
    const currentPrimary = wallets.find(w => w.isPrimary);
    const newPrimary = wallets.find(w => w.id === walletId);

    if (!newPrimary) {
      throw new Error('Wallet not found');
    }

    if (newPrimary.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await runTransaction(db, async (transaction) => {
      if (currentPrimary) {
        const currentPrimaryRef = doc(db, 'wallets', currentPrimary.id);
        transaction.update(currentPrimaryRef, {
          isPrimary: false,
          updatedAt: serverTimestamp()
        });
      }

      const newPrimaryRef = doc(db, 'wallets', walletId);
      transaction.update(newPrimaryRef, {
        isPrimary: true,
        updatedAt: serverTimestamp()
      });
    });

    await logAuditEvent({
      action: 'wallet_primary_changed',
      targetId: walletId,
      userId,
      details: `Set ${newPrimary.currency} wallet as primary`
    });
  } catch (error) {
    console.error('Error setting primary wallet:', error);
    throw error;
  }
}

export async function processTransaction(walletId: string, userId: string, data: TransactionData): Promise<void> {
  if (!walletId || !userId) {
    throw new Error('Wallet ID and User ID are required');
  }

  if (!data.amount || data.amount <= 0) {
    throw new Error('Invalid transaction amount');
  }

  if (data.amount < MIN_TRANSACTION_AMOUNT || data.amount > MAX_TRANSACTION_AMOUNT) {
    throw new Error(`Amount must be between ${MIN_TRANSACTION_AMOUNT} and ${MAX_TRANSACTION_AMOUNT}`);
  }

  try {
    const securityResult = await performSecurityCheck({
      userId,
      amount: data.amount,
      type: data.type
    });

    if (securityResult.score > 90) {
      const flags = securityResult.flags.join(', ');
      throw new Error(`Transaction blocked due to security concerns: ${flags}`);
    }

    const fraudCheck = await detectFraud({
      userId,
      amount: data.amount,
      currency: 'USD',
      type: data.type,
      metadata: data.metadata || {}
    });

    if (fraudCheck.isFraudulent) {
      throw new Error(`Transaction blocked: ${fraudCheck.reason}`);
    }

    await runTransaction(db, async (transaction) => {
      const walletRef = doc(db, 'wallets', walletId);
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists()) {
        throw new Error('Wallet not found');
      }

      const wallet = walletDoc.data() as Wallet;

      if (wallet.userId !== userId) {
        throw new Error('Unauthorized access to wallet');
      }

      if (wallet.status !== 'active') {
        throw new Error('Wallet is not active');
      }

      let newBalance = wallet.balance;

      switch (data.type) {
        case 'deposit':
          newBalance += data.amount;
          break;
        case 'withdrawal':
          if (wallet.balance < data.amount) {
            throw new Error('Insufficient funds');
          }
          newBalance -= data.amount;
          break;
        case 'transfer':
          if (wallet.balance < data.amount) {
            throw new Error('Insufficient funds');
          }
          newBalance -= data.amount;
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: data.type,
        amount: data.amount,
        description: data.description,
        metadata: data.metadata,
        timestamp: Timestamp.now()
      };

      const transactions = wallet.transactions || [];
      transactions.push(newTransaction);

      transaction.update(walletRef, {
        balance: newBalance,
        updatedAt: serverTimestamp(),
        transactions
      });
    });

    await logAuditEvent({
      action: `wallet_${data.type}`,
      targetId: walletId,
      userId,
      details: `${data.type} of ${data.amount} processed`,
      metadata: data.metadata
    });
  } catch (error: any) {
    console.error('Transaction failed:', error);
    throw new Error(error.message || 'Failed to process transaction. Please try again.');
  }
}

export async function getWalletTransactions(walletId: string, userId: string, options: {
  limit?: number;
  startAfter?: Date;
  type?: 'deposit' | 'withdrawal' | 'transfer';
} = {}): Promise<Transaction[]> {
  try {
    const walletRef = doc(db, 'wallets', walletId);
    const walletDoc = await getDoc(walletRef);

    if (!walletDoc.exists()) {
      throw new Error('Wallet not found');
    }

    if (walletDoc.data().userId !== userId) {
      throw new Error('Unauthorized');
    }

    const wallet = walletDoc.data();
    let transactions = wallet.transactions || [];

    if (options.type) {
      transactions = transactions.filter((tx: Transaction) => tx.type === options.type);
    }

    if (options.startAfter) {
      transactions = transactions.filter((tx: Transaction) => 
        tx.timestamp.toDate() > options.startAfter
      );
    }

    transactions.sort((a: Transaction, b: Transaction) => 
      b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
    );

    if (options.limit) {
      transactions = transactions.slice(0, options.limit);
    }

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}