
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductForm } from "@/components/admin/ProductForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewProductPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

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
          <Link href="/admin/products" className="text-[10px] font-black text-slate-400 hover:text-primary flex items-center gap-2 mb-6 uppercase tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Back to Inventory
          </Link>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-slate-900">Create Product</h1>
          <p className="text-slate-500 text-lg font-medium">Use the form below to list a new item on your store.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
          <ProductForm />
        </div>
      </main>
    </div>
  );
}
