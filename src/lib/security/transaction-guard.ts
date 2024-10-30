import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import { logAuditEvent } from '../audit';
import { UserRole } from '../auth';
import { generateTransactionHash, verifyTransactionHash } from './crypto';

interface TransactionGuardOptions {
  userId: string;
  userRole: UserRole;
  walletId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  description?: string;
}

interface SecurityCheck {
  passed: boolean;
  reason?: string;
}

export class TransactionGuard {
  private static readonly RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_TRANSACTIONS = 10; // Max transactions per window
  private static readonly SUSPICIOUS_AMOUNT = 10000; // Amount that triggers extra verification

  private static async checkUserPermissions(userId: string, walletId: string): Promise<SecurityCheck> {
    const walletDoc = await getDoc(doc(db, 'wallets', walletId));
    
    if (!walletDoc.exists()) {
      return { passed: false, reason: 'Wallet not found' };
    }

    if (walletDoc.data().userId !== userId) {
      await logAuditEvent({
        action: 'unauthorized_access_attempt',
        targetId: walletId,
        userId,
        details: 'Attempted unauthorized wallet access',
        metadata: { severity: 'HIGH' }
      });
      return { passed: false, reason: 'Unauthorized wallet access' };
    }

    return { passed: true };
  }

  private static async checkRateLimit(userId: string): Promise<SecurityCheck> {
    const now = Date.now();
    const windowStart = now - this.RATE_LIMIT_WINDOW;

    const userDoc = await getDoc(doc(db, 'users', userId));
    const recentTransactions = (userDoc.data()?.recentTransactions || [])
      .filter((tx: any) => tx.timestamp > windowStart);

    if (recentTransactions.length >= this.MAX_TRANSACTIONS) {
      await logAuditEvent({
        action: 'rate_limit_exceeded',
        targetId: userId,
        userId,
        details: 'Transaction rate limit exceeded',
        metadata: { severity: 'MEDIUM' }
      });
      return { passed: false, reason: 'Rate limit exceeded. Please try again later.' };
    }

    return { passed: true };
  }

  private static async checkSuspiciousActivity(options: TransactionGuardOptions): Promise<SecurityCheck> {
    const { userId, amount, type } = options;

    // Check for suspicious amount
    if (amount > this.SUSPICIOUS_AMOUNT) {
      await logAuditEvent({
        action: 'suspicious_amount_detected',
        targetId: userId,
        userId,
        details: 'Large transaction amount detected',
        metadata: { amount, type, severity: 'HIGH' }
      });
      return { passed: false, reason: 'Transaction amount requires additional verification' };
    }

    // Check for unusual patterns
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    if (userData?.lastTransactionLocation !== userData?.currentLocation) {
      await logAuditEvent({
        action: 'location_mismatch',
        targetId: userId,
        userId,
        details: 'Transaction location mismatch',
        metadata: { severity: 'HIGH' }
      });
      return { passed: false, reason: 'Unusual location detected. Please verify your identity.' };
    }

    return { passed: true };
  }

  public static async verifyTransaction(options: TransactionGuardOptions): Promise<SecurityCheck> {
    try {
      // 1. Check user permissions
      const permissionCheck = await this.checkUserPermissions(options.userId, options.walletId);
      if (!permissionCheck.passed) return permissionCheck;

      // 2. Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(options.userId);
      if (!rateLimitCheck.passed) return rateLimitCheck;

      // 3. Check for suspicious activity
      const suspiciousCheck = await this.checkSuspiciousActivity(options);
      if (!suspiciousCheck.passed) return suspiciousCheck;

      return { passed: true };
    } catch (error) {
      console.error('Security check failed:', error);
      await logAuditEvent({
        action: 'security_check_error',
        targetId: options.userId,
        userId: options.userId,
        details: 'Security verification failed',
        metadata: { error: error.message, severity: 'HIGH' }
      });
      return { passed: false, reason: 'Security verification failed' };
    }
  }

  public static async processSecureTransaction(options: TransactionGuardOptions): Promise<void> {
    const securityCheck = await this.verifyTransaction(options);
    
    if (!securityCheck.passed) {
      throw new Error(securityCheck.reason);
    }

    return runTransaction(db, async (transaction) => {
      const walletRef = doc(db, 'wallets', options.walletId);
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists()) {
        throw new Error('Wallet not found');
      }

      const wallet = walletDoc.data();
      const transactionHash = generateTransactionHash({
        walletId: options.walletId,
        amount: options.amount,
        timestamp: Date.now(),
        userId: options.userId
      });

      // Verify transaction integrity
      if (!verifyTransactionHash(transactionHash)) {
        await logAuditEvent({
          action: 'transaction_integrity_failure',
          targetId: options.walletId,
          userId: options.userId,
          details: 'Transaction hash verification failed',
          metadata: { severity: 'CRITICAL' }
        });
        throw new Error('Transaction integrity check failed');
      }

      // Update wallet balance
      let newBalance = wallet.balance;
      switch (options.type) {
        case 'deposit':
          newBalance += options.amount;
          break;
        case 'withdrawal':
        case 'transfer':
          if (wallet.balance < options.amount) {
            throw new Error('Insufficient funds');
          }
          newBalance -= options.amount;
          break;
      }

      // Update wallet with new balance and transaction record
      transaction.update(walletRef, {
        balance: newBalance,
        lastModified: Date.now(),
        transactionHash,
        transactions: [
          ...(wallet.transactions || []),
          {
            id: `tx_${Date.now()}`,
            type: options.type,
            amount: options.amount,
            description: options.description,
            timestamp: Date.now(),
            hash: transactionHash,
            status: 'completed'
          }
        ]
      });

      // Log the transaction for audit
      await logAuditEvent({
        action: `transaction_${options.type}`,
        targetId: options.walletId,
        userId: options.userId,
        details: `${options.type} transaction processed`,
        metadata: {
          amount: options.amount,
          newBalance,
          transactionHash,
          severity: 'INFO'
        }
      });
    });
  }
}