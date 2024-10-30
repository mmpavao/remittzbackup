import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { LoadingScreen } from '@/components/loading-screen';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setUserData, setLoading, loading } = useAuthStore();

  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeData = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user) {
        // Subscribe to user data changes
        unsubscribeData = onSnapshot(
          doc(db, 'users', user.uid),
          (doc) => {
            if (doc.exists()) {
              setUserData(doc.data() as any);
            } else {
              setUserData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching user data:', error);
            setUserData(null);
            setLoading(false);
          }
        );
      } else {
        setUserData(null);
        setLoading(false);
        unsubscribeData();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, [setUser, setUserData, setLoading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}