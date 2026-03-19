"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useCollection, useFirestore } from "@/firebase";
import { collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function AdminProducts() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const handleDelete = (productId: string) => {
    if (!db) return;
    
    deleteDoc(doc(db, 'products', productId))
      .then(() => {
        toast({ title: "Product Deleted", description: "The item has been removed from the catalog." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `products/${productId}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Products</h1>
            <p className="text-muted-foreground text-lg">Manage your catalog, stock, and descriptions.</p>
          </div>
          <Button asChild className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/admin/products/new">
              <Plus className="h-5 w-5 mr-2" /> Add New Product
            </Link>
          </Button>
        </header>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 bg-muted/30 border-none" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Synchronizing with catalog...</p>
              </div>
            ) : products && products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted border">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                      </TableCell>
                      <TableCell>
                        <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider">{product.category}</span>
                      </TableCell>
                      <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                          {product.stock} units
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-destructive/5 hover:text-destructive"
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
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl">
                <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg">No Products Found</h3>
                <p className="text-muted-foreground mb-6">Start building your catalog by adding your first product.</p>
                <Button asChild variant="outline">
                  <Link href="/admin/products/new">Create First Listing</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}