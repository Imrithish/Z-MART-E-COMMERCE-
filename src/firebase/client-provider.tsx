'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [firebaseData, setFirebaseData] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    const { app, auth, db } = initializeFirebase();
    setFirebaseData({ app, auth, db });
    setMounted(true);
  }, []);

  // Standard fallback to match server render and initial client mount
  const LoadingFallback = () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Z-MART...</p>
      </div>
    </div>
  );

  if (!mounted || !firebaseData) {
    return <LoadingFallback />;
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
