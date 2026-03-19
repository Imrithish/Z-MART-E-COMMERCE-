
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/mock-data";
import { Star, Loader2, ShoppingBag, Zap, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
        {displayProducts.length > 0 ? (
          displayProducts.map((product: any) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border border-slate-100 shadow-sm bg-white rounded-[1.5rem] flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 h-full"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-slate-50 p-4 md:p-6">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-4 md:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-4 md:p-5">
                  <div className="flex-1 space-y-2">
                    <div className="text-[9px] md:text-[10px] text-primary uppercase tracking-widest font-black">{product.category}</div>
                    <CardTitle className="text-sm md:text-base font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] uppercase tracking-tight leading-tight">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-2.5 w-2.5 md:h-3 md:w-3 ${i <= Math.floor(product.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black text-slate-900 ml-1">{(product.reviews || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 md:pt-6 border-t border-slate-50 space-y-3">
                    <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter block">{formatCurrency(product.price)}</span>
                    <div className="flex gap-2">
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-slate-900 hover:bg-primary text-white hover:text-slate-900 flex-1 h-10 md:h-11 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                        className="h-10 w-10 md:h-11 md:w-11 p-0 rounded-xl border-slate-200"
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
          <div className="col-span-full py-16 md:py-24 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
             <div className="bg-slate-50 h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 md:h-10 md:w-10 text-slate-200" />
             </div>
            <p className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">No products found</p>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium">Try checking your spelling or use more general terms.</p>
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-4 md:py-8 flex-1 max-w-[1450px]">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
          <ProductList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
