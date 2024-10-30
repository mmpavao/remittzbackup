import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirebaseError } from './firebase';
import { logRegistration } from './logger';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface LoginData {
  email: string;
  password: string;
}

export type UserRole = 'user' | 'admin' | 'super_admin';

interface UserData {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: any;
  role: UserRole;
  isMasterAccount: boolean;
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: number;
  };
  status: 'active' | 'pending' | 'suspended';
  defaultCurrency: string;
  wallets: {
    [key: string]: {
      currency: string;
      balance: number;
      isDefault: boolean;
    };
  };
  permissions: {
    canManageUsers: boolean;
    canManageApiKeys: boolean;
    canViewAnalytics: boolean;
    canModifySettings: boolean;
    canManagePayments: boolean;
  };
}

const MASTER_ADMIN_EMAIL = 'pavaosmart@gmail.com';

export async function setupMasterAdmin(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const updateData = {
      role: 'super_admin' as UserRole,
      isMasterAccount: true,
      permissions: {
        canManageUsers: true,
        canManageApiKeys: true,
        canViewAnalytics: true,
        canModifySettings: true,
        canManagePayments: true
      }
    };

    await updateDoc(userRef, updateData);
    return true;
  } catch (error: any) {
    console.error('Failed to set up master admin:', error);
    throw new Error(handleFirebaseError(error));
  }
}

export async function registerUser(data: RegisterData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const { user } = userCredential;

    const userLocale = navigator.language;
    const currencyFormat = new Intl.NumberFormat(userLocale, { 
      style: 'currency', 
      currency: 'USD' 
    });
    const defaultCurrency = currencyFormat.resolvedOptions().currency;

    const userData: UserData = {
      uid: user.uid,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      createdAt: serverTimestamp(),
      role: data.email === MASTER_ADMIN_EMAIL ? 'super_admin' : 'user',
      isMasterAccount: data.email === MASTER_ADMIN_EMAIL,
      securitySettings: {
        twoFactorEnabled: false,
        lastPasswordChange: Date.now(),
      },
      status: 'active',
      defaultCurrency,
      wallets: {
        [defaultCurrency]: {
          currency: defaultCurrency,
          balance: 0,
          isDefault: true
        }
      },
      permissions: {
        canManageUsers: data.email === MASTER_ADMIN_EMAIL,
        canManageApiKeys: data.email === MASTER_ADMIN_EMAIL,
        canViewAnalytics: data.email === MASTER_ADMIN_EMAIL,
        canModifySettings: data.email === MASTER_ADMIN_EMAIL,
        canManagePayments: data.email === MASTER_ADMIN_EMAIL
      }
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    
    logRegistration('success', 'User registered successfully');
    return { user, userData };
  } catch (error: any) {
    logRegistration('error', `Registration failed: ${error.message}`);
    throw new Error(handleFirebaseError(error));
  }
}

export async function loginUser(data: LoginData) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      logRegistration('error', 'User data not found in database');
      throw new Error('User data not found. Please contact support.');
    }

    const userData = userDoc.data() as UserData;

    if (userData.status === 'suspended') {
      logRegistration('error', 'Account is suspended');
      throw new Error('Your account has been suspended. Please contact support.');
    }

    if (data.email === MASTER_ADMIN_EMAIL && !userData.isMasterAccount) {
      await setupMasterAdmin(userCredential.user.uid);
      userData.role = 'super_admin';
      userData.isMasterAccount = true;
    }

    logRegistration('success', 'User logged in successfully');
    return { user: userCredential.user, userData };
  } catch (error: any) {
    logRegistration('error', `Login failed: ${error.message}`);
    throw new Error(handleFirebaseError(error));
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    throw new Error(handleFirebaseError(error));
  }
}

export function hasAdminAccess(role?: UserRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function hasSuperAdminAccess(role?: UserRole): boolean {
  return role === 'super_admin';
}

export function checkPermission(userData: UserData | null, permission: keyof UserData['permissions']): boolean {
  if (!userData) return false;
  if (userData.role === 'super_admin') return true;
  return userData.permissions[permission] || false;
}