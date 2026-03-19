
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  // Memoize firebase initialization to prevent redundant calls
  const firebaseData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const { app, auth, db } = initializeFirebase();
    return { app, auth, db };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard lightweight fallback to match server render and initial client mount
  if (!mounted || !firebaseData) {
    return (
      <div className="h-svh w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
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
