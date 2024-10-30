import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserRole } from './auth';

interface TransactionLimits {
  daily: number;
  monthly: number;
  perTransaction: number;
}

const DEFAULT_LIMITS: Record<UserRole, TransactionLimits> = {
  user: {
    daily: 5000,
    monthly: 20000,
    perTransaction: 2000
  },
  admin: {
    daily: 50000,
    monthly: 200000,
    perTransaction: 10000
  },
  super_admin: {
    daily: 100000,
    monthly: 500000,
    perTransaction: 50000
  }
};

export async function checkTransactionLimits(
  userId: string,
  amount: number,
  type: 'deposit' | 'withdrawal' | 'transfer'
): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const userLimits = DEFAULT_LIMITS[userData.role as UserRole];
    const transactions = userData.transactions || [];

    // Check per-transaction limit
    if (amount > userLimits.perTransaction) {
      throw new Error(`Amount exceeds per-transaction limit of ${userLimits.perTransaction}`);
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Calculate daily total
    const dailyTotal = transactions
      .filter((tx: any) => tx.timestamp > oneDayAgo && tx.type === type)
      .reduce((sum: number, tx: any) => sum + tx.amount, 0);

    if (dailyTotal + amount > userLimits.daily) {
      throw new Error(`Amount exceeds daily limit of ${userLimits.daily}`);
    }

    // Calculate monthly total
    const monthlyTotal = transactions
      .filter((tx: any) => tx.timestamp > oneMonthAgo && tx.type === type)
      .reduce((sum: number, tx: any) => sum + tx.amount, 0);

    if (monthlyTotal + amount > userLimits.monthly) {
      throw new Error(`Amount exceeds monthly limit of ${userLimits.monthly}`);
    }

    return true;
  } catch (error) {
    console.error('Limit check failed:', error);
    throw error;
  }
}