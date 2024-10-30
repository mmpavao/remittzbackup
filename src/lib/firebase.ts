import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { isSupported, getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDurQe9wASLJRYOU4VByXUArt6V01YWEDs",
  authDomain: "remmit-6e8c2.firebaseapp.com",
  projectId: "remmit-6e8c2",
  storageBucket: "remmit-6e8c2.appspot.com",
  messagingSenderId: "1095631677623",
  appId: "1:1095631677623:web:5b302bbc98125c30dc8532",
  measurementId: "G-CS5BGERWGE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics only if supported and in production
export let analytics = null;
if (import.meta.env.PROD) {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(console.warn);
}

// Development helper
export const isDevelopment = import.meta.env.DEV;
export const currentDomain = window.location.hostname;

// Firebase error handler
export const handleFirebaseError = (error: any) => {
  console.error('Firebase error:', error);
  
  const errorMap: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-email': 'Please enter a valid email address',
  };

  return errorMap[error?.code] || error?.message || 'An error occurred. Please try again.';
};