
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Star, CheckCircle2, Loader2, ShoppingBag, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useCallback } from "react";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { ToastAction } from "@/components/ui/toast";
import { useCollection, useFirestore } from "@/firebase";
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
    return [...products].sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || 0;
      const dateB = b.createdAt?.toDate?.() || 0;
      return dateB - dateA;
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

  const handleAddToCart = useCallback((e: React.MouseEvent, product: any) => {
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
            <Image 
              src={product.imageUrl || 'https://placehold.co/100x100?text=No+Image'} 
              alt={product.name} 
              fill 
              className="object-contain p-1" 
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-black text-slate-900 line-clamp-1">{product.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ready for checkout</p>
          </div>
        </div>
      ) as any,
      action: (
        <ToastAction altText="View Cart" asChild>
          <Link href="/cart" className="amazon-btn-primary text-[10px] px-4 py-2 rounded-xl">
            View Cart
          </Link>
        </ToastAction>
      ),
    });
  }, [addItem, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Premium Catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-body">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Search Bar Section - Placed at the top of Home */}
        <section className="bg-slate-900 py-10 px-4 md:px-8 border-b border-white/5">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">What are you looking for?</h1>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">Discover our premium catalog</p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center h-16 rounded-2xl overflow-hidden bg-white shadow-2xl focus-within:ring-4 focus-within:ring-primary/20 transition-all">
              <Input 
                placeholder="Search products, categories, electronics..." 
                className="flex-1 border-none focus-visible:ring-0 text-slate-900 h-full px-8 text-lg font-bold placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-full bg-primary hover:bg-primary/90 px-8 transition-colors flex items-center justify-center gap-2 group">
                <Search className="h-6 w-6 text-slate-900 group-hover:scale-110 transition-transform" />
                <span className="hidden md:block font-black uppercase tracking-widest text-slate-900 text-xs">Search</span>
              </button>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-[1450px] mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Electronics", hint: "modern tech", href: "/products?category=Electronics", seed: "tech" },
              { title: "Home & Kitchen", hint: "minimalist kitchen", href: "/products?category=Home & Kitchen", seed: "kitchen" },
              { title: "Fashion", hint: "model pose", href: "/products?category=Fashion", seed: "style" },
              { title: "New Arrivals", hint: "new drop", href: "/products", seed: "new" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href}>
                <Card className="bg-white p-6 rounded-none shadow-sm flex flex-col h-full group cursor-pointer hover:shadow-xl transition-all duration-300 border-none">
                  <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">{cat.title}</h3>
                  <div className="relative aspect-video w-full bg-slate-50 rounded-lg overflow-hidden mb-6">
                    <Image 
                      src={`https://picsum.photos/seed/${cat.seed}/600/400`}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
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

        {deals.length > 0 && (
          <section className="max-w-[1450px] mx-auto px-4 md:px-8 py-12">
            <Card className="bg-white rounded-none border-none shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Flash Deals</h2>
                  <Link href="/products" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                    See all offers
                  </Link>
                </div>
              </div>

              <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                {deals.map((product: any) => (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer min-w-[220px] max-w-[220px] flex flex-col"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden p-6 mb-4">
                      <Image 
                        src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'} 
                        alt={product.name} 
                        fill 
                        className="object-contain transition-transform duration-500 group-hover:scale-110" 
                      />
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white font-black uppercase text-[8px] tracking-widest px-2 py-0.5 border-none rounded-sm">
                        Deal
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through font-bold">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-700 line-clamp-2 leading-snug uppercase tracking-tight">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        <section className="max-w-[1450px] mx-auto px-4 md:px-8 py-12">
          <Card className="bg-white rounded-none border-none shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Just Dropped</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The latest additions to our store</p>
              </div>
              <Link href="/products" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
                Browse Full Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {newArrivals.slice(0, 12).map((product: any) => (
                <div 
                  key={product.id} 
                  className="group cursor-pointer flex flex-col"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden p-6 mb-4 group-hover:shadow-md transition-all">
                    <Image 
                      src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'} 
                      alt={product.name} 
                      fill 
                      className="object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-[11px] font-bold text-slate-900 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-md font-black text-slate-900">{formatCurrency(product.price)}</span>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-20 border-t border-white/5">
        <div className="max-w-[1450px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Z-MART</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
              The premium gateway to modern commerce.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Digital Catalog</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">Member Dashboard</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Basket</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Support</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Usage</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Terminal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1450px] mx-auto px-8 mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2024 Z-MART GLOBAL OPERATIONS</p>
        </div>
      </footer>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
