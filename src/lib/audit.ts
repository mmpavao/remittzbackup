import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '@/store/auth';

interface AuditEvent {
  action: string;
  targetId?: string;
  userId?: string;
  details?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent({
  action,
  targetId,
  userId,
  details,
  metadata = {}
}: AuditEvent) {
  try {
    // Ensure we have a valid action
    if (!action) {
      throw new Error('Action is required for audit logging');
    }

    // Get current user if userId not provided
    if (!userId) {
      const currentUser = useAuthStore.getState().user;
      userId = currentUser?.uid;
    }

    // Don't proceed if we still don't have a userId
    if (!userId) {
      console.warn('No user ID available for audit logging');
      return;
    }

    const auditRef = collection(db, 'audit_logs');
    
    const auditData = {
      action,
      targetId,
      userId,
      details,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        timestamp: serverTimestamp(),
        environment: import.meta.env.MODE
      }
    };

    // Validate all fields to ensure they're of the correct type
    Object.entries(auditData).forEach(([key, value]) => {
      if (value === undefined) {
        delete auditData[key as keyof typeof auditData];
      }
    });

    await addDoc(auditRef, auditData);

  } catch (error) {
    // Log error but don't throw - we don't want audit logging to break core functionality
    console.error('Failed to log audit event:', error);
  }
}