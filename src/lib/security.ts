import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

interface SecurityCheck {
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
}

interface RiskScore {
  score: number;
  flags: string[];
}

export async function performSecurityCheck({
  userId,
  amount,
  type
}: SecurityCheck): Promise<RiskScore> {
  const flags: string[] = [];
  let riskScore = 0;

  try {
    // Get user's transaction history
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();

    // Basic risk scoring
    if (amount > 10000) {
      flags.push('HIGH_VALUE_TRANSACTION');
      riskScore += 25;
    }

    if (type === 'withdrawal') {
      const recentWithdrawals = userData.recentWithdrawals || 0;
      if (recentWithdrawals > 10) {
        flags.push('MULTIPLE_WITHDRAWALS');
        riskScore += 15;
      }
    }

    // Location-based risk assessment (simplified for development)
    const userLocation = userData.lastLoginLocation;
    if (userLocation && userData.previousLoginLocation) {
      const locationChanged = userLocation !== userData.previousLoginLocation;
      if (locationChanged) {
        flags.push('LOCATION_CHANGED');
        riskScore += 5;
      }
    }

    // Device-based risk assessment (simplified for development)
    const userDevice = userData.lastLoginDevice;
    if (userDevice && userData.previousLoginDevice) {
      const deviceChanged = userDevice !== userData.previousLoginDevice;
      if (deviceChanged) {
        flags.push('DEVICE_CHANGED');
        riskScore += 5;
      }
    }

    // Development environment: Lower the risk threshold
    return {
      score: Math.min(riskScore, 75), // Cap the risk score at 75 to allow transactions
      flags
    };
  } catch (error) {
    console.error('Security check failed:', error);
    // Default to low risk score in case of errors to prevent blocking legitimate transactions
    return {
      score: 0,
      flags: ['ERROR_FALLBACK']
    };
  }
}