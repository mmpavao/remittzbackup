import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { logAuditEvent } from './audit';

interface VerificationOptions {
  userId: string;
  type: 'email' | 'phone' | 'device';
  code: string;
}

export async function verifyTransaction({
  userId,
  type,
  code
}: VerificationOptions): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const pendingVerification = userData.pendingVerification;

    if (!pendingVerification || pendingVerification.type !== type) {
      throw new Error('No pending verification');
    }

    if (pendingVerification.expiresAt < Date.now()) {
      throw new Error('Verification code expired');
    }

    if (pendingVerification.attempts >= 3) {
      throw new Error('Too many attempts');
    }

    if (pendingVerification.code !== code) {
      // Increment attempts
      await updateDoc(userRef, {
        'pendingVerification.attempts': pendingVerification.attempts + 1
      });
      throw new Error('Invalid verification code');
    }

    // Clear pending verification
    await updateDoc(userRef, {
      pendingVerification: null,
      [`${type}Verified`]: true,
      lastVerifiedAt: Date.now()
    });

    await logAuditEvent({
      action: 'verification_success',
      targetId: userId,
      userId,
      details: `${type} verification successful`
    });

    return true;
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  }
}