
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayProducts.length > 0 ? (
          displayProducts.map((product: any) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-none shadow-sm bg-white rounded-xl md:rounded-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProductClick(product)}
            >
              {/* Mobile List UI vs Desktop Grid UI wrapper */}
              <div className="flex flex-row sm:flex-col h-full">
                <div className="relative w-32 h-32 sm:w-full sm:aspect-square overflow-hidden bg-gray-50 p-2 sm:p-4 shrink-0">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-3 sm:p-0">
                  <CardHeader className="pt-0 sm:pt-4 pb-1 sm:pb-2 px-0 sm:px-4 space-y-0.5 sm:space-y-1">
                    <div className="text-[9px] sm:text-[11px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer uppercase tracking-wider font-bold">{product.category}</div>
                    <CardTitle className="text-xs sm:text-base font-medium group-hover:text-[#c45500] transition-colors line-clamp-2 min-h-0 sm:min-h-[3rem]">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                       <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i <= Math.floor(product.rating || 5) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#007185] ml-1">{(product.reviews || 0).toLocaleString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-4 pb-2 sm:pb-4 mt-auto">
                    <div className="flex items-baseline gap-1">
                       <span className="text-lg sm:text-2xl font-bold">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="hidden sm:block text-[11px] text-gray-500 mt-1">Get it by Tomorrow, 10 AM</p>
                    <p className="hidden sm:block text-[11px] text-gray-500">FREE Delivery by Z-Mart</p>
                  </CardContent>
                  <CardFooter className="px-0 sm:px-4 pb-3 sm:pb-4 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="amazon-btn-primary flex-1 h-8 text-[9px] sm:text-xs rounded-full"
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                        className="sm:hidden h-8 w-8 p-0 rounded-full border-slate-200"
                      >
                        <Zap className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-sm shadow-sm">
            <p className="text-lg font-medium text-gray-600">No products found.</p>
            <p className="text-sm text-gray-400 mt-1">Try checking your spelling or use more general terms.</p>
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
    <div className="min-h-screen bg-[#eaeded] flex flex-col">
      <Navbar />
      <main className="container mx-auto px-2 md:px-4 py-4 md:py-8 flex-1">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
          <ProductList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
