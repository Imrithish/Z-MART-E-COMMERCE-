'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebaseData, setFirebaseData] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    const { app, auth, db } = initializeFirebase();
    setFirebaseData({ app, auth, db });
  }, []);

  if (!firebaseData) {
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
