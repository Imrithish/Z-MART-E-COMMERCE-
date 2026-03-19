
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/mock-data";
import { Star, Loader2, ShoppingBag, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useMemo, useCallback } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

function ProductList() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allProducts, loading } = useCollection(productsQuery);

  const displayProducts = useMemo(() => {
    if (!allProducts) return [];
    let filtered = [...allProducts];

    if (categoryFilter && categoryFilter !== "All Categories") {
      filtered = filtered.filter((p: any) => p.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [allProducts, categoryFilter, searchQuery]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleAddToCart = useCallback((e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addItem(product);
  }, [addItem]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {displayProducts.length > 0 ? (
          displayProducts.map((product: any) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-none shadow-sm bg-white rounded-xl sm:rounded-2xl flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 h-full border border-slate-100/50"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex flex-row sm:flex-col h-full">
                <div className="relative w-32 h-32 sm:w-full sm:aspect-square overflow-hidden bg-slate-50 p-2 sm:p-6 shrink-0">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-3 sm:p-5">
                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <div className="text-[9px] sm:text-[10px] text-primary uppercase tracking-widest font-black">{product.category}</div>
                    <CardTitle className="text-xs sm:text-base font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] uppercase tracking-tight leading-tight">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                       <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i <= Math.floor(product.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-900 ml-1">{(product.reviews || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(product.price)}</span>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-slate-900 hover:bg-primary text-white hover:text-slate-900 flex-1 h-9 sm:h-11 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                        className="sm:hidden h-9 w-9 p-0 rounded-lg border-slate-200"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-200" />
             </div>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight">No products found</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Try checking your spelling or use more general terms.</p>
          </div>
        )}
      </div>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default function StorefrontProducts() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-body">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-8 flex-1 max-w-[1450px]">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
          <ProductList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
