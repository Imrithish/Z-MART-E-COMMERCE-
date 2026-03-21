
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminProducts() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const productsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: products, loading: dataLoading } = useCollection(productsQuery);

  const handleDelete = (productId: string) => {
    if (!db) return;
    
    deleteDoc(doc(db, 'products', productId))
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `products/${productId}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-10 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">Inventory</h1>
              {!dataLoading && products && (
                <Badge variant="outline" className="hidden sm:flex h-8 px-4 rounded-xl border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest bg-white">
                  {products.length} Total Items
                </Badge>
              )}
            </div>
            <p className="text-slate-500 text-sm md:text-lg font-medium">Manage your products, stock levels, and store listings.</p>
          </div>
          <Button asChild className="h-14 px-8 rounded-2xl shadow-xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 w-full md:w-auto">
            <Link href="/admin/products/new" className="text-white flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" /> Add New Product
            </Link>
          </Button>
        </header>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-4 border-b border-slate-50">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search catalog..." className="pl-11 bg-slate-50 border-none rounded-xl h-12 font-bold" />
            </div>
            <Button variant="outline" className="w-full md:w-auto gap-2 h-12 rounded-xl px-6 font-black uppercase tracking-widest text-[10px] border-slate-200">
              <Filter className="h-4 w-4" /> Filter Category
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {dataLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="w-[100px] px-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">Image</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Product Name</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Category</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Price</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">In Stock</TableHead>
                      <TableHead className="text-right px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: any) => (
                      <TableRow key={product.id} className="group border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="px-8">
                          <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="font-black text-slate-900 text-lg leading-tight mb-1">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1">{product.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-slate-900 text-lg">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-slate-900">{product.stock}</span>
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>Units</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                              <Link href={`/admin/products/${product.id}`}>
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-32 bg-slate-50/50">
                <div className="bg-white h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                   <Plus className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">No Products Found</h3>
                <p className="text-slate-500 mb-10 font-medium">Your inventory is currently empty.</p>
                <Button asChild className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest">
                  <Link href="/admin/products/new" className="text-white">Create First Listing</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
