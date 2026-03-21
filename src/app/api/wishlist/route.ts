import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase (Server-side compatible since it's just the db instance)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// GET /api/wishlist?userId=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const snapshot = await getDocs(wishlistRef);
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/wishlist
// Body: { userId: "123", product: { id: "p1", name: "Laptop", price: 999, imageUrl: "..." } }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, product } = body;

    if (!userId || !product || !product.id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = doc(db, 'users', userId, 'wishlist', product.id);
    await setDoc(docRef, {
      id: product.id,
      name: product.name || '',
      price: product.price || 0,
      imageUrl: product.imageUrl || '',
      addedAt: new Date().toISOString() // API responds better with strings
    });

    return NextResponse.json({ success: true, message: "Added to wishlist" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/wishlist
// Body: { userId: "123", productId: "p1" }
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = doc(db, 'users', userId, 'wishlist', productId);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: "Removed from wishlist" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
