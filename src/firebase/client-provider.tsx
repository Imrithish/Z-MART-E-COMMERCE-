'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize Firebase only on the client side
  const firebaseData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const { app, auth, db } = initializeFirebase();
    return { app, auth, db };
  }, []);

  // Return null during server-side rendering and initial client-side mount
  // to avoid hydration mismatches. The real UI will be rendered after mounting.
  if (!mounted || !firebaseData) {
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseData.app}
      auth={firebaseData.auth}
      firestore={firebaseData.db}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
