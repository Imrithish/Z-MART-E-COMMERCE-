
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Loader2, ShoppingBag, Search, Zap, ArrowRight, Star, TrendingUp, Sparkles, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useMemo, useCallback } from "react";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";
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
  const db = useFirestore();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(100));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const curatedSections = useMemo(() => {
    if (!products) return { newArrivals: [], bestSellers: [], popular: [] };
    
    return {
      newArrivals: products.slice(0, 6),
      bestSellers: products.filter((p: any) => p.rating >= 4.8 || p.isBestSeller).slice(0, 6),
      popular: products.filter((p: any) => p.reviews > 1000).slice(0, 6)
    };
  }, [products]);

  const productsByCategory = useMemo(() => {
    if (!products) return {};
    return products.reduce((acc: Record<string, any[]>, product: any) => {
      const cat = product.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});
  }, [products]);

  const categoryEntries = useMemo(() => Object.entries(productsByCategory).slice(0, 4), [productsByCategory]);

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
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Loading Z-MART Marketplace...</p>
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: any }) => (
    <div 
      className="group cursor-pointer flex flex-col h-full bg-white p-6 rounded-[2.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-slate-100/50 hover:border-primary/20 hover:-translate-y-2"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative aspect-square bg-slate-50/50 rounded-[2rem] overflow-hidden p-6 mb-6 group-hover:bg-white transition-colors duration-500">
        <Image 
          src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'} 
          alt={product.name} 
          fill 
          className="object-contain transition-transform duration-1000 ease-out group-hover:scale-110 p-2" 
        />
        {product.isDeal && (
          <Badge className="absolute top-4 left-4 bg-red-600 text-white border-none text-[8px] font-black tracking-widest px-2.5 py-1 rounded-lg shadow-lg animate-pulse">
            DEAL
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
           <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{product.category}</p>
           <h3 className="text-[13px] font-extrabold text-slate-800 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors h-8">
             {product.name}
           </h3>
           <div className="flex items-center gap-1 mt-2">
             <div className="flex items-center gap-0.5">
               <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
               <span className="text-[10px] font-black text-slate-900">{product.rating}</span>
             </div>
             <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">({(product.reviews || 0).toLocaleString()})</span>
           </div>
        </div>
        
        <div className="mt-auto space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[9px] text-slate-300 line-through font-bold tracking-tight">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
              className="h-11 w-11 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all duration-500 shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
          <Button 
            onClick={(e) => handleBuyNowClick(e, product)}
            className="w-full h-12 bg-slate-900 hover:bg-primary text-white hover:text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all duration-500 shadow-xl shadow-slate-900/10 active:scale-95 border-none"
          >
            <Zap className="h-3.5 w-3.5 mr-2 fill-current" /> Buy Now
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-body">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Hero Search Section */}
        <section className="bg-slate-900 py-12 md:py-24 px-4 md:px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">The Premium Standard</h1>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs md:text-sm opacity-60">Global Curated Marketplace</p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center h-16 md:h-20 rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl focus-within:ring-8 focus-within:ring-primary/20 transition-all">
              <Input 
                placeholder="Search premium essentials..." 
                className="flex-1 border-none focus-visible:ring-0 text-slate-900 h-full px-8 md:px-12 text-lg font-bold placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-full bg-primary hover:bg-primary/90 px-10 md:px-14 transition-colors flex items-center justify-center gap-3 group">
                <Search className="h-6 w-6 text-slate-900 group-hover:scale-110 transition-transform" />
                <span className="hidden md:block font-black uppercase tracking-widest text-slate-900 text-sm">Search</span>
              </button>
            </form>
          </div>
        </section>

        {/* Quick Access Categories */}
        <section className="max-w-[1450px] mx-auto px-4 md:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Digital Tech", hint: "laptop tech", href: "/products?category=Electronics", seed: "digital" },
              { title: "Luxe Home", hint: "living room", href: "/products?category=Home & Kitchen", seed: "interior" },
              { title: "High Fashion", hint: "clothing style", href: "/products?category=Fashion", seed: "style-vogue" },
              { title: "Flash Deals", hint: "discount shopping", href: "/products", seed: "offer" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href}>
                <Card className="bg-white p-7 rounded-[2.5rem] shadow-xl flex flex-col h-full group cursor-pointer hover:-translate-y-2 transition-all duration-500 border-none">
                  <h3 className="text-xl font-black text-slate-900 mb-5 uppercase tracking-tight">{cat.title}</h3>
                  <div className="relative aspect-[16/10] w-full bg-slate-50 rounded-2xl overflow-hidden mb-6 shadow-inner border border-slate-100">
                    <Image 
                      src={`https://picsum.photos/seed/${cat.seed}/600/400`}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      data-ai-hint={cat.hint}
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary group-hover:underline uppercase tracking-widest mt-auto flex items-center gap-2">
                    Browse Collection <ArrowRight className="h-3 w-3" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-[1450px] mx-auto px-4 md:px-8 py-20 space-y-32">
          
          {/* Section 1: New Arrivals */}
          {curatedSections.newArrivals.length > 0 && (
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">New Arrivals</h2>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Freshly stocked this week</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {curatedSections.newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* Section 2: First Category */}
          {categoryEntries[0] && (
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{categoryEntries[0][0]}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated {categoryEntries[0][0]} Essentials</p>
                </div>
                <Link href={`/products?category=${categoryEntries[0][0]}`} className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {categoryEntries[0][1].slice(0, 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Best Sellers */}
          {curatedSections.bestSellers.length > 0 && (
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Best Sellers</h2>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Most loved by our community</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {curatedSections.bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* Section 4: Second Category */}
          {categoryEntries[1] && (
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{categoryEntries[1][0]}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated {categoryEntries[1][0]} Essentials</p>
                </div>
                <Link href={`/products?category=${categoryEntries[1][0]}`} className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {categoryEntries[1][1].slice(0, 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Popular Now */}
          {curatedSections.popular.length > 0 && (
            <section className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Popular Now</h2>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Trending globally on Z-MART</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {curatedSections.popular.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* Section 6 & 7: Remaining Categories */}
          {categoryEntries.slice(2, 4).map(([category, catProducts]) => (
            <section key={category} className="space-y-10">
              <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{category}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated {category} Essentials</p>
                </div>
                <Link href={`/products?category=${category}`} className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {catProducts.slice(0, 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
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
