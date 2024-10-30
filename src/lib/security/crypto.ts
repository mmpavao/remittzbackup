import { createHash, randomBytes } from 'crypto';

interface TransactionData {
  walletId: string;
  amount: number;
  timestamp: number;
  userId: string;
}

// Secret key should be stored in environment variables in production
const SECRET_KEY = process.env.TRANSACTION_SECRET_KEY || 'your-secret-key';

export function generateTransactionHash(data: TransactionData): string {
  const nonce = randomBytes(16).toString('hex');
  
  const payload = JSON.stringify({
    ...data,
    nonce,
    secret: SECRET_KEY
  });

  return createHash('sha256')
    .update(payload)
    .digest('hex');
}

export function verifyTransactionHash(hash: string): boolean {
  try {
    // Implement hash verification logic
    // This could involve checking against a list of valid hashes
    // or verifying the hash structure and signature
    return true;
  } catch (error) {
    console.error('Hash verification failed:', error);
    return false;
  }
}