'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/mock-data';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  // Load from database if user, else from local storage
  useEffect(() => {
    if (authLoading) return;
    
    if (user && db) {
      // Sync from Firestore for authenticated users
      const loadUserCart = async () => {
        try {
          const docRef = doc(db, 'users', user.uid, 'cart', 'data');
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
             const cloudItems = docSnap.data().items || [];
             setItems(cloudItems);
          } else {
             // If they just logged in and have local items but no cloud items, we'll sync up in the other effect
             const savedCart = localStorage.getItem('zmart_cart');
             if (savedCart) {
                setItems(JSON.parse(savedCart));
             } else {
                setItems([]);
             }
          }
        } catch (e) {
          console.error("Failed to load cloud cart", e);
        } finally {
          setIsInitialized(true);
        }
      };
      
      loadUserCart();
    } else {
      // Guest user: restore local storage cart
      const savedCart = localStorage.getItem('zmart_cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      } else {
        setItems([]);
      }
      setIsInitialized(true);
    }
  }, [user, db, authLoading]);

  // Persist to database if user, else to local storage
  useEffect(() => {
    if (!isInitialized) return;

    if (user && db) {
      // Authenticated: backup securely to Cloud Firestore
      const docRef = doc(db, 'users', user.uid, 'cart', 'data');
      setDoc(docRef, { items, updatedAt: Date.now() }, { merge: true })
        .catch((e: any) => console.error("Failed to save cloud cart", e));
      
      // We don't save to local storage for users to ensure real logout functionality
      localStorage.removeItem('zmart_cart');
    } else {
      // Guest: stash locally
      localStorage.setItem('zmart_cart', JSON.stringify(items));
    }
  }, [items, isInitialized, user, db]);

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
