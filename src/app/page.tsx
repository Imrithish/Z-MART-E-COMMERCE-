
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Star, CheckCircle2, Loader2, ShieldCheck, Truck, RotateCcw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useCallback } from "react";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { ToastAction } from "@/components/ui/toast";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the latest 20 products from Firestore
  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(20));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  // Derived collections
  const deals = useMemo(() => products?.filter((p: any) => p.isDeal) || [], [products]);
  const newArrivals = useMemo(() => products || [], [products]);

  const handleProductClick = useCallback((product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

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
          <Link href="/cart" className="amazon-btn-primary text-[10px] px-4 py-2 rounded-xl">
            View Cart
          </Link>
        </ToastAction>
      ),
    });
  }, [addItem, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Initializing Storefront...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-body">
      <Navbar />

      <main className="flex-1">
        {/* Simple Hero Section */}
        <section className="relative w-full h-[500px] overflow-hidden bg-slate-900">
          <Image 
            src="https://picsum.photos/seed/zmart-hero/1920/1080"
            alt="Hero Banner"
            fill
            className="object-cover opacity-60"
            priority
            data-ai-hint="minimalist setup"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
              The Future of <span className="text-primary">Commerce</span>
            </h1>
            <p className="text-slate-300 max-w-lg text-sm md:text-base font-medium mb-8">
              Experience the absolute peak of modern shopping. Curated electronics, premium fashion, and home essentials.
            </p>
          </div>
        </section>

        {/* Shop by Category Grid */}
        <section className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Electronics", hint: "modern electronics", href: "/products?category=Electronics", desc: "Latest gadgets & tech" },
              { title: "Home & Kitchen", hint: "modern kitchen", href: "/products?category=Home & Kitchen", desc: "Upgrade your living space" },
              { title: "Fashion", hint: "luxury fashion", href: "/products?category=Fashion", desc: "Trendsetting styles" },
              { title: "New Arrivals", hint: "premium boxes", href: "/products", desc: "Just added to our catalog" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href}>
                <Card className="bg-white p-6 rounded-3xl shadow-sm flex flex-col h-full group cursor-pointer hover:shadow-xl transition-all duration-500 border-none">
                  <div className="relative aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden mb-6">
                    <Image 
                      src={`https://picsum.photos/seed/cat-grid-${idx}/600/600`}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={cat.hint}
                    />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">{cat.desc}</p>
                  <span className="text-[10px] font-black text-primary group-hover:underline uppercase tracking-widest mt-auto">
                    Explore Now
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust Bar */}
        <section className="max-w-[1400px] mx-auto px-6 py-6">
           <div className="bg-white p-8 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">Fast Delivery</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Free Express over ₹2000</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">10 Days Return</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Hassle-free exchanges</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">Secure Payments</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">100% Protected encryption</p>
                </div>
              </div>
           </div>
        </section>

        {/* Flash Deals Row */}
        {deals.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Flash Deals</h2>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Limited time offers</p>
              </div>
              <Link href="/products" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
                See all deals
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {deals.slice(0, 4).map((product: any) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer flex flex-col bg-white rounded-[2rem] overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden p-8">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white font-black uppercase text-[8px] tracking-widest px-3 py-1 border-none rounded-full">
                      Deal
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-sm font-black text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-xl font-black text-slate-900">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-bold">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Just Dropped Row */}
        <section className="max-w-[1400px] mx-auto px-6 py-12 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Just Dropped</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Freshly added items</p>
            </div>
            <Link href="/products" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
              View catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.slice(0, 8).map((product: any) => (
              <div 
                key={product.id} 
                className="group cursor-pointer flex flex-col"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative aspect-square bg-white rounded-[2rem] shadow-sm overflow-hidden p-8 mb-4 border border-slate-50 group-hover:shadow-xl transition-all duration-500">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <div className="space-y-1 flex-1 px-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4 px-2">
                  <span className="text-xl font-black text-slate-900">{formatCurrency(product.price)}</span>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleAddToCart(e, product)}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {newArrivals.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 mt-6 shadow-sm">
              <ShoppingBag className="h-12 w-12 text-slate-100 mx-auto mb-4" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Our catalog is coming soon</h3>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-20 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-black tracking-tighter">Z-MART</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
              The architecture of modern commerce. We curate technology that defines generations.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="/products" className="hover:text-primary">Catalog Interface</Link></li>
              <li><Link href="/account" className="hover:text-primary">Member Orders</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary">Merchant Hub</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Legal Core</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><Link href="#" className="hover:text-primary">Privacy Protocol</Link></li>
              <li><Link href="#" className="hover:text-primary">Usage Terms</Link></li>
              <li><Link href="#" className="hover:text-primary">Help Terminal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2024 Z-MART GLOBAL OPERATIONS • ALL RIGHTS RESERVED</p>
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
