
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Star, ChevronRight, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Zap, Globe, Truck, RotateCcw, ShoppingBag } from "lucide-react";
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
        {/* Amazon-style Hero Banner */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/zmart-banner/1920/1080"
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
            data-ai-hint="minimalist setup"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100" />
        </section>

        {/* Overlapping Category Grid (Amazon Layout) */}
        <section className="max-w-[1400px] mx-auto px-6 -mt-[350px] relative z-20 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Electronics", hint: "modern electronics", href: "/products?category=Electronics", desc: "Latest gadgets & tech" },
              { title: "Home & Kitchen", hint: "modern kitchen", href: "/products?category=Home & Kitchen", desc: "Upgrade your living space" },
              { title: "Fashion", hint: "luxury fashion", href: "/products?category=Fashion", desc: "Trendsetting styles" },
              { title: "New Arrivals", hint: "premium boxes", href: "/products", desc: "Just added to our catalog" }
            ].map((cat, idx) => (
              <Card key={idx} className="bg-white p-6 rounded-none shadow-sm flex flex-col h-full group cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <Link href={cat.href} className="relative flex-1 block overflow-hidden mb-4">
                  <div className="relative aspect-square w-full bg-slate-50">
                    <Image 
                      src={`https://picsum.photos/seed/cat-card-${idx}/600/600`}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={cat.hint}
                    />
                  </div>
                </Link>
                <div className="mt-auto">
                   <p className="text-sm text-slate-500 mb-3">{cat.desc}</p>
                   <Link href={cat.href} className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline uppercase tracking-tight">
                     Shop Now
                   </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Bar */}
        <section className="max-w-[1400px] mx-auto px-6 py-6">
           <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-3 gap-8 border border-slate-200">
              <div className="flex items-center gap-4">
                <Truck className="h-6 w-6 text-slate-400" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Fast Delivery</h4>
                  <p className="text-[10px] text-slate-500">Free Express Shipping over ₹2000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <RotateCcw className="h-6 w-6 text-slate-400" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">10 Days Return</h4>
                  <p className="text-[10px] text-slate-500">Hassle-free Returns & Exchanges</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-slate-400" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Secure Payments</h4>
                  <p className="text-[10px] text-slate-500">100% Protected & Encrypted</p>
                </div>
              </div>
           </div>
        </section>

        {/* Flash Deals Row */}
        {deals.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 py-8">
            <Card className="bg-white p-6 rounded-none border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Flash Deals</h2>
                <Link href="/products" className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline uppercase tracking-tight">
                  See all deals
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deals.slice(0, 4).map((product: any) => (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer flex flex-col"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 mb-3">
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-contain transition-transform group-hover:scale-105" 
                      />
                      <Badge className="absolute top-2 left-2 bg-[#cc0c39] text-white font-bold text-[9px] px-2 py-0.5 border-none">
                        Deal
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1 mb-1 group-hover:text-[#c45500]">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Just Dropped Row */}
        <section className="max-w-[1400px] mx-auto px-6 py-8 pb-20">
          <Card className="bg-white p-6 rounded-none border-none shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Just Dropped</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Freshly added items</p>
              </div>
              <Link href="/products" className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline uppercase tracking-tight">
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
                  <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 mb-4">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-contain transition-transform group-hover:scale-105" 
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-[#c45500] transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {newArrivals.length === 0 && (
              <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 mt-6">
                <ShoppingBag className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Our catalog is coming soon</h3>
              </div>
            )}
          </Card>
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
