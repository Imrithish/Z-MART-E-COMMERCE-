
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Product } from "@/lib/mock-data";
import { Star, ChevronRight, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Zap, Globe, Truck, RotateCcw } from "lucide-react";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(20));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const deals = useMemo(() => products?.filter((p: any) => p.isDeal) || [], [products]);

  const handleProductClick = useCallback((product: Product) => {
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
        <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Loading Experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[700px] md:h-[850px] overflow-hidden bg-slate-950">
          <Image 
            src="https://picsum.photos/seed/zmart-hero-luxury/1920/1080"
            alt="Hero Background"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
            data-ai-hint="luxury electronics"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-white" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div className="max-w-4xl space-y-10">
              <div className="space-y-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-6 py-2 rounded-full font-black uppercase tracking-[0.4em] text-[10px]">
                  Curated Collection 2024
                </Badge>
                <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                  BEYOND <br /> ORDINARY.
                </h1>
                <p className="text-slate-300 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                  Discover the next generation of lifestyle technology. Handpicked, curated, and delivered with surgical precision.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <Button asChild className="h-20 px-12 rounded-[2rem] amazon-btn-primary text-sm shadow-2xl shadow-primary/40">
                  <Link href="/products">Shop The Future <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] backdrop-blur-md">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Trust Bar */}
        <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-40">
           <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-12 border border-slate-50">
              <div className="flex items-center gap-6 group">
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Truck className="h-8 w-8 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-1">Fast Delivery</h4>
                  <p className="text-xs font-medium text-slate-500">Free Express Shipping on Orders over ₹2000</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <RotateCcw className="h-8 w-8 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-1">10 Days Return</h4>
                  <p className="text-xs font-medium text-slate-500">Hassle-free Returns & Exchanges</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <ShieldCheck className="h-8 w-8 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-1">Secure Payments</h4>
                  <p className="text-xs font-medium text-slate-500">100% Protected & Encrypted Checkout</p>
                </div>
              </div>
           </div>
        </section>

        {/* Categories Showcase */}
        <section className="max-w-[1400px] mx-auto px-6 py-32 space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Product Tiers</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Shop by Category</h2>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">Explore our curated collections across technology, home, and fashion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Electronics", hint: "electronics gadgets", color: "bg-blue-500", h: "h-[500px]", href: "/products?category=Electronics" },
              { title: "Kitchen", hint: "kitchen appliance", color: "bg-purple-500", h: "h-[650px] lg:-mt-20", href: "/products?category=Home & Kitchen" },
              { title: "Fashion", hint: "fashion model", color: "bg-emerald-500", h: "h-[450px]", href: "/products?category=Fashion" },
              { title: "Home Decor", hint: "interior design", color: "bg-orange-500", h: "h-[550px] lg:-mt-10", href: "/products?category=Home" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href}>
                <Card className={`group relative overflow-hidden ${cat.h} rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer`}>
                  <Image 
                    src={`https://picsum.photos/seed/cat-${idx}-creative/800/1200`}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    data-ai-hint={cat.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{cat.title}</h3>
                    <div className="inline-flex items-center text-xs font-black text-primary uppercase tracking-widest hover:translate-x-3 transition-transform">
                      Explore Tier <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals Section */}
        <section className="bg-slate-50 py-32">
          <div className="max-w-[1400px] mx-auto px-6 space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase">Flash Deals</h2>
              <p className="text-slate-500 font-medium text-lg">Limited production runs. Absolute price points.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {deals.slice(0, 4).map((product: any) => (
                <Card 
                  key={product.id} 
                  className="group relative flex flex-col border-none bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square bg-white overflow-hidden p-10">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-contain transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-[#cc0c39] text-white font-black uppercase text-[9px] tracking-[0.2em] px-4 py-2 border-none rounded-full shadow-lg">
                        -{Math.round((1 - product.price / (product.originalPrice || product.price * 1.2)) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.rating} Performance Score</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 line-clamp-1 tracking-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-3xl font-black text-slate-900">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                      <Button 
                        size="icon"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="h-14 w-14 rounded-2xl amazon-btn-primary"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="ghost" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-primary hover:bg-white transition-all">
                <Link href="/products">Initialize Full Catalog <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-white py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <h2 className="text-5xl font-black tracking-tighter">Z-MART</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              The architecture of modern commerce. We curate technology that defines generations.
            </p>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-950 transition-all cursor-pointer">
                <Globe className="h-5 w-5" />
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-950 transition-all cursor-pointer">
                <Zap className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Navigation</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><Link href="/products" className="hover:text-primary transition-colors">Catalog Interface</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">Member Orders</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Merchant Hub</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Legal Core</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Usage Terms</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Terminal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2024 Z-MART GLOBAL OPERATIONS • ALL RIGHTS RESERVED</p>
          <div className="flex gap-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span>ISO 27001 SECURE</span>
            <span>PREMIUM VERIFIED</span>
          </div>
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
