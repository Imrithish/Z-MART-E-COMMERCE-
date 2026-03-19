
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CheckCircle2, Loader2, ShoppingBag, ArrowRight, Search, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useCallback } from "react";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { ToastAction } from "@/components/ui/toast";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Home() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();
  const { user } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), limit(24));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const deals = useMemo(() => products?.filter((p: any) => p.isDeal) || [], [products]);
  const newArrivals = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a: any) => {
      // Keep original order but ensure it's a new array
      return 0;
    });
  }, [products]);

  const handleProductClick = useCallback((product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleBuyNowClick = useCallback((e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    handleProductClick(product);
  }, [handleProductClick]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Premium Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-body">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Search Bar Section */}
        <section className="bg-slate-900 py-12 md:py-20 px-4 md:px-8 border-b border-white/5">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3 mb-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Find Your Next Essential</h1>
              <p className="text-slate-400 font-medium text-sm md:text-base uppercase tracking-widest opacity-80">Curated Premium Selection</p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center h-16 md:h-20 rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-2xl focus-within:ring-8 focus-within:ring-primary/20 transition-all">
              <Input 
                placeholder="Search products, tech, fashion..." 
                className="flex-1 border-none focus-visible:ring-0 text-slate-900 h-full px-8 md:px-10 text-lg md:text-xl font-bold placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-full bg-primary hover:bg-primary/90 px-8 md:px-12 transition-colors flex items-center justify-center gap-3 group">
                <Search className="h-6 w-6 text-slate-900 group-hover:scale-110 transition-transform" />
                <span className="hidden md:block font-black uppercase tracking-widest text-slate-900 text-sm">Search</span>
              </button>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-[1450px] mx-auto px-4 md:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Electronics", hint: "modern tech", href: "/products?category=Electronics", seed: "tech" },
              { title: "Home & Kitchen", hint: "minimalist kitchen", href: "/products?category=Home & Kitchen", seed: "kitchen" },
              { title: "Fashion", hint: "model pose", href: "/products?category=Fashion", seed: "style" },
              { title: "New Arrivals", hint: "new drop", href: "/products", seed: "new" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href}>
                <Card className="bg-white p-6 rounded-3xl shadow-xl flex flex-col h-full group cursor-pointer hover:-translate-y-2 transition-all duration-500 border-none">
                  <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{cat.title}</h3>
                  <div className="relative aspect-[16/10] w-full bg-slate-50 rounded-2xl overflow-hidden mb-6">
                    <Image 
                      src={`https://picsum.photos/seed/${cat.seed}/600/400`}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      data-ai-hint={cat.hint}
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary group-hover:underline uppercase tracking-widest mt-auto flex items-center gap-2">
                    Explore Now <ArrowRight className="h-3 w-3" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals Section */}
        {deals.length > 0 && (
          <section className="max-w-[1450px] mx-auto px-4 md:px-8 py-16">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Flash Deals</h2>
                <Badge className="bg-red-600 text-white border-none text-[10px] uppercase font-black tracking-widest px-3 py-1">Limited Time</Badge>
              </div>
              <Link href="/products" className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">
                See all offers
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {deals.map((product: any) => (
                <div 
                  key={product.id} 
                  className="group cursor-pointer flex flex-col h-full bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden p-6 mb-6">
                    <Image 
                      src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'} 
                      alt={product.name} 
                      fill 
                      className="object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xl font-black text-slate-900">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through font-bold">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-700 line-clamp-2 uppercase tracking-tight leading-snug group-hover:text-primary transition-colors min-h-[2.5rem] mb-4">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <Button 
                        onClick={(e) => handleBuyNowClick(e, product)}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                      >
                        <Zap className="h-3 w-3 mr-2 fill-current" /> Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Just Dropped Section */}
        <section className="max-w-[1450px] mx-auto px-4 md:px-8 py-16 bg-white rounded-[4rem] my-12 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Just Dropped</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Fresh Arrivals • Premium Quality</p>
            </div>
            <Link href="/products" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
              Browse Full Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {newArrivals.slice(0, 12).map((product: any) => (
              <div 
                key={product.id} 
                className="group cursor-pointer flex flex-col h-full bg-slate-50/50 p-4 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative aspect-square bg-white rounded-2xl overflow-hidden p-6 mb-5">
                  <Image 
                    src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'} 
                    alt={product.name} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-105" 
                  />
                  <Badge className="absolute top-2 right-2 bg-slate-900/5 text-slate-400 border-none text-[8px] font-black tracking-widest px-2 py-0.5">NEW</Badge>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-[11px] font-bold text-slate-900 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors min-h-[2.2rem] mb-4">
                    {product.name}
                  </h3>
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">{formatCurrency(product.price)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(product);
                        }}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                    <Button 
                      onClick={(e) => handleBuyNowClick(e, product)}
                      className="w-full h-10 bg-slate-900 hover:bg-primary text-white hover:text-slate-900 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all shadow-md active:scale-95"
                    >
                      <Zap className="h-3 w-3 mr-2 fill-current" /> Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
