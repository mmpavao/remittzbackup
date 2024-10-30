import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { logAuditEvent } from './audit';

export interface BankAccount {
  currency: string;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  agencia?: string;
  swift?: string;
  iban?: string;
}

export interface Connection {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending';
  createdAt: Date;
  lastModified: Date;
  lastTransaction?: Date;
  bankAccounts: BankAccount[];
  metadata?: Record<string, any>;
}

export async function createConnection(data: Omit<Connection, 'id' | 'createdAt' | 'lastModified' | 'status'>) {
  if (!data.fullName?.trim()) {
    throw new Error('Full name is required');
  }
  if (!data.email?.trim()) {
    throw new Error('Email is required');
  }
  if (!data.bankAccounts?.length) {
    throw new Error('At least one bank account is required');
  }

  try {
    // Check if connection already exists
    const existingQuery = query(
      collection(db, 'connections'),
      where('email', '==', data.email),
      where('status', 'in', ['active', 'pending'])
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      throw new Error('A connection with this email already exists');
    }

    // Validate bank accounts
    data.bankAccounts.forEach((account, index) => {
      if (!account.currency?.trim()) {
        throw new Error(`Currency is required for bank account ${index + 1}`);
      }
      if (!account.bankName?.trim()) {
        throw new Error(`Bank name is required for bank account ${index + 1}`);
      }
      if (!account.accountNumber?.trim()) {
        throw new Error(`Account number is required for bank account ${index + 1}`);
      }
    });

    const timestamp = serverTimestamp();
    const connectionData = {
      ...data,
      status: 'active',
      createdAt: timestamp,
      lastModified: timestamp,
      metadata: {
        ...data.metadata,
        createdAt: Date.now()
      }
    };

    const docRef = await addDoc(collection(db, 'connections'), connectionData);

    await logAuditEvent({
      action: 'connection_created',
      targetId: docRef.id,
      details: `Created connection: ${data.email}`,
      metadata: {
        email: data.email,
        bankAccounts: data.bankAccounts.length
      }
    });

    return {
      id: docRef.id,
      ...connectionData,
      createdAt: new Date(),
      lastModified: new Date()
    };
  } catch (error: any) {
    console.error('Failed to create connection:', error);
    throw new Error(error.message || 'Failed to create connection');
  }
}

export async function updateConnection(id: string, updates: Partial<Connection>) {
  if (!id) {
    throw new Error('Connection ID is required');
  }

  try {
    const connectionRef = doc(db, 'connections', id);
    const connectionDoc = await getDoc(connectionRef);

    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    // Validate updates
    if (updates.email && updates.email !== connectionDoc.data().email) {
      const existingQuery = query(
        collection(db, 'connections'),
        where('email', '==', updates.email),
        where('status', 'in', ['active', 'pending'])
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (!existingDocs.empty) {
        throw new Error('A connection with this email already exists');
      }
    }

    const timestamp = serverTimestamp();
    const updateData = {
      ...updates,
      lastModified: timestamp
    };

    await updateDoc(connectionRef, updateData);

    await logAuditEvent({
      action: 'connection_updated',
      targetId: id,
      details: `Updated connection: ${connectionDoc.data().email}`,
      metadata: {
        updatedFields: Object.keys(updates),
        email: connectionDoc.data().email
      }
    });

    return true;
  } catch (error: any) {
    console.error('Failed to update connection:', error);
    throw new Error(error.message || 'Failed to update connection');
  }
}

export async function deleteConnection(id: string) {
  if (!id) {
    throw new Error('Connection ID is required');
  }

  try {
    const connectionRef = doc(db, 'connections', id);
    const connectionDoc = await getDoc(connectionRef);

    if (!connectionDoc.exists()) {
      throw new Error('Connection not found');
    }

    const timestamp = serverTimestamp();
    await updateDoc(connectionRef, {
      status: 'deleted',
      lastModified: timestamp
    });

    await logAuditEvent({
      action: 'connection_deleted',
      targetId: id,
      details: `Deleted connection: ${connectionDoc.data().email}`,
      metadata: {
        email: connectionDoc.data().email,
        previousStatus: connectionDoc.data().status
      }
    });

    return true;
  } catch (error: any) {
    console.error('Failed to delete connection:', error);
    throw new Error(error.message || 'Failed to delete connection');
  }
}

export async function addTestConnections(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const testConnections = [
    {
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 890',
      status: 'active',
      bankAccounts: [
        {
          currency: 'USD',
          bankName: 'Chase Bank',
          accountNumber: '****4567',
          routingNumber: '****8901'
        }
      ],
      lastTransaction: new Date('2024-03-14'),
      metadata: { createdBy: userId }
    },
    {
      fullName: 'Michael Chen',
      email: 'michael@example.com',
      status: 'active',
      bankAccounts: [
        {
          currency: 'EUR',
          bankName: 'Deutsche Bank',
          accountNumber: '****7890',
          swift: 'DEUTDEFF',
          iban: 'DE89****4567'
        }
      ],
      lastTransaction: new Date('2024-03-13'),
      metadata: { createdBy: userId }
    },
    {
      fullName: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 345 678 901',
      status: 'pending',
      bankAccounts: [
        {
          currency: 'BRL',
          bankName: 'Itaú',
          accountNumber: '****5678',
          agencia: '****'
        }
      ],
      metadata: { createdBy: userId }
    }
  ];

  for (const connection of testConnections) {
    try {
      await createConnection(connection);
    } catch (error) {
      console.error('Failed to create test connection:', error);
    }
  }
}