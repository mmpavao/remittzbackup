import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { logAuditEvent } from './audit';
import { hasPermission } from './permissions';
import { UserRole } from './auth';

interface TransactionOptions {
  userId: string;
  userRole: UserRole;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  sourceWalletId?: string;
  destinationWalletId?: string;
  metadata?: Record<string, any>;
}

export async function processTransaction({
  userId,
  userRole,
  amount,
  currency,
  type,
  sourceWalletId,
  destinationWalletId,
  metadata = {}
}: TransactionOptions) {
  // Validate amount
  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  // Validate permissions
  if (!hasPermission(userRole, 'canManagePayments')) {
    throw new Error('Unauthorized operation');
  }

  try {
    // Use Firebase transaction to ensure atomicity
    await runTransaction(db, async (transaction) => {
      // Get source wallet if applicable
      let sourceWallet;
      if (sourceWalletId) {
        const sourceWalletRef = doc(db, 'wallets', sourceWalletId);
        sourceWallet = await transaction.get(sourceWalletRef);
        
        if (!sourceWallet.exists()) {
          throw new Error('Source wallet not found');
        }

        // Verify wallet ownership
        if (sourceWallet.data().userId !== userId) {
          throw new Error('Unauthorized wallet access');
        }

        // Check sufficient funds
        if (sourceWallet.data().balance < amount) {
          throw new Error('Insufficient funds');
        }
      }

      // Get destination wallet if applicable
      let destinationWallet;
      if (destinationWalletId) {
        const destinationWalletRef = doc(db, 'wallets', destinationWalletId);
        destinationWallet = await transaction.get(destinationWalletRef);
        
        if (!destinationWallet.exists()) {
          throw new Error('Destination wallet not found');
        }

        // Verify currency match
        if (destinationWallet.data().currency !== currency) {
          throw new Error('Currency mismatch');
        }
      }

      // Create transaction record
      const transactionRef = doc(db, 'transactions', `tx_${Date.now()}`);
      transaction.set(transactionRef, {
        userId,
        type,
        amount,
        currency,
        sourceWalletId,
        destinationWalletId,
        status: 'pending',
        createdAt: serverTimestamp(),
        metadata: {
          ...metadata,
          ipAddress: null, // Should be set by backend
          userAgent: navigator.userAgent,
          geoLocation: null // Should be set by backend
        }
      });

      // Update wallet balances
      if (sourceWallet) {
        transaction.update(doc(db, 'wallets', sourceWalletId!), {
          balance: sourceWallet.data().balance - amount,
          updatedAt: serverTimestamp()
        });
      }

      if (destinationWallet) {
        transaction.update(doc(db, 'wallets', destinationWalletId!), {
          balance: destinationWallet.data().balance + amount,
          updatedAt: serverTimestamp()
        });
      }

      // Log audit event
      await logAuditEvent({
        action: `transaction_${type}`,
        targetId: transactionRef.id,
        userId,
        details: `${type} of ${amount} ${currency}`,
        metadata: {
          sourceWalletId,
          destinationWalletId,
          amount,
          currency
        }
      });
    });

    return true;
  } catch (error: any) {
    console.error('Transaction failed:', error);
    throw new Error(error.message);
  }
}