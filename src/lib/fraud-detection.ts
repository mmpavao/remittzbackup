import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

interface TransactionData {
  userId: string;
  amount: number;
  currency: string;
  type: string;
  metadata: Record<string, any>;
}

export async function detectFraud(transaction: TransactionData): Promise<{
  isFraudulent: boolean;
  reason?: string;
}> {
  try {
    const userDoc = await getDoc(doc(db, 'users', transaction.userId));
    if (!userDoc.exists()) {
      return { isFraudulent: true, reason: 'User not found' };
    }

    const userData = userDoc.data();
    const userTransactions = userData.transactions || [];

    // Simplified checks for development environment
    const recentTransactions = userTransactions.filter((tx: any) => {
      const txTime = new Date(tx.timestamp).getTime();
      const now = Date.now();
      return now - txTime < 24 * 60 * 60 * 1000; // Last 24 hours
    });

    // Relaxed velocity check
    if (recentTransactions.length > 50) {
      return {
        isFraudulent: true,
        reason: 'Unusual transaction frequency detected'
      };
    }

    // Simplified amount pattern check
    const unusualAmount = recentTransactions.every((tx: any) => {
      return Math.abs(tx.amount - transaction.amount) < 0.01;
    });

    if (unusualAmount && recentTransactions.length > 10) {
      return {
        isFraudulent: true,
        reason: 'Suspicious amount pattern detected'
      };
    }

    // Development mode: Allow most transactions
    return { isFraudulent: false };
  } catch (error) {
    console.error('Fraud detection error:', error);
    // Default to allowing transactions in case of errors
    return { isFraudulent: false };
  }
}