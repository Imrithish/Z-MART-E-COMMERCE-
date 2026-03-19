
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { Star, Filter, SlidersHorizontal, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useFirestore } from "@/firebase";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { ToastAction } from "@/components/ui/toast";

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
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayProducts, setDisplayProducts] = useState<any[]>(MOCK_PRODUCTS);

  useEffect(() => {
    let filtered = [...MOCK_PRODUCTS];

    if (categoryFilter) {
      filtered = filtered.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    setDisplayProducts(filtered);
  }, [categoryFilter, searchQuery]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addItem(product);
    toast({
      title: (
        <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px]">
          <CheckCircle2 className="h-4 w-4" /> Added to Cart
        </div>
      ) as any,
      description: (
        <div className="flex items-center gap-3 mt-2">
          <div className="relative h-12 w-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
            <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-black text-slate-900 line-clamp-1">{product.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ready for checkout</p>
          </div>
        </div>
      ) as any,
      action: (
        <ToastAction altText="View Cart" asChild>
          <Link href="/cart" className="bg-primary hover:bg-primary/90 text-black font-black text-[10px] px-4 py-2 rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20">
            View Cart
          </Link>
        </ToastAction>
      ),
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-none shadow-sm bg-white rounded-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                <Image 
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pt-4 pb-2 px-4 space-y-1">
                <div className="text-[11px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer uppercase tracking-wider font-bold">{product.category}</div>
                <CardTitle className="text-base font-medium group-hover:text-[#c45500] transition-colors line-clamp-2 min-h-[3rem]">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                   <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-3 w-3 ${i <= Math.floor(product.rating) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#007185] ml-1">{product.reviews.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                   {product.originalPrice && (
                     <span className="text-xs text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                   )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Get it by Tomorrow, 10 AM</p>
                <p className="text-[11px] text-gray-500">FREE Delivery by Z-Mart</p>
              </CardContent>
              <CardFooter className="mt-auto px-4 pb-4 pt-0">
                <Button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="amazon-btn-primary w-full h-8 text-xs rounded-full"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-sm shadow-sm">
            <p className="text-lg font-medium text-gray-600">No results found for your search.</p>
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
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-white p-6 shadow-sm rounded-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {q ? `Results for "${q}"` : "Search Results"}
            </h1>
            <p className="text-sm text-gray-500">Showing items from our premium collection.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 h-9 text-xs">
              <SlidersHorizontal className="h-4 w-4" /> Sort By
            </Button>
            <Button variant="outline" className="gap-2 h-9 text-xs">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
          <ProductList />
        </Suspense>
      </main>
    </div>
  );
}
