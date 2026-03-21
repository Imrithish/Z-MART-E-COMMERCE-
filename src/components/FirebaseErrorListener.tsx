'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      // In a real development environment, this would trigger a helpful overlay.
      // For now, we'll throw the error so it reaches the Next.js error boundary.
      throw error;
    });
    return () => unsubscribe();
  }, []);

  return null;
}
