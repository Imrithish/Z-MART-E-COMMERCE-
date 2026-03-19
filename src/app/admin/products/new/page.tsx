import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductForm } from "@/components/admin/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header>
          <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
            <ChevronLeft className="h-4 w-4" /> Back to Products
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Product</h1>
          <p className="text-muted-foreground text-lg">Use the form below to list a new item on your store.</p>
        </header>

        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
          <ProductForm />
        </div>
      </main>
    </div>
  );
}