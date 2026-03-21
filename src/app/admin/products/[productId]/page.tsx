"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductForm } from "@/components/admin/ProductForm";
import { ChevronLeft, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const db = useFirestore();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const productRef = useMemo(() => {
    if (!db || !productId) return null;
    return doc(db, 'products', productId);
  }, [db, productId]);

  const { data: product, loading: dataLoading } = useDoc(productRef);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header>
          <Link href="/admin/products" className="text-xs font-black text-slate-400 hover:text-primary flex items-center gap-2 mb-6 uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Edit Product</h1>
          </div>
          <p className="text-slate-500 text-lg font-medium">Update listing details for your premium store.</p>
        </header>

        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving Product Data...</p>
            </div>
          ) : product ? (
            <ProductForm initialData={product} />
          ) : (
            <div className="text-center py-24">
              <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Loader2 className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Product Not Found</h3>
              <p className="text-slate-500 mb-8">The requested item could not be identified in your database.</p>
              <Button asChild className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-xs text-white">
                <Link href="/admin/products">Return to Inventory</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}