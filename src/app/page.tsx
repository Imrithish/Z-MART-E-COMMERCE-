"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Product } from "@/lib/mock-data";
import { Star, ChevronRight, ChevronLeft, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/zmart-hero/1920/1080"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            data-ai-hint="luxury electronics"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center px-6 md:px-20">
            <div className="max-w-2xl space-y-6 md:space-y-10">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                  New Collection 2024
                </span>
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                  THE FUTURE <br /> OF PREMIUM.
                </h1>
                <p className="text-slate-300 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                  Experience the next generation of lifestyle technology. Handpicked, curated, and delivered with precision.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="h-16 px-10 rounded-2xl amazon-btn-primary text-xs">
                  <Link href="/products">Explore Catalog <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
                  Watch Film
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories / Featured Grid */}
        <div className="max-w-[1400px] mx-auto px-6 -mt-32 relative z-30 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Smart Living", hint: "smart home", color: "bg-blue-500" },
              { title: "Audio Excellence", hint: "high end headphones", color: "bg-purple-500" },
              { title: "Elite Tech", hint: "modern laptop", color: "bg-emerald-500" },
              { title: "Curated Style", hint: "fashion model", color: "bg-orange-500" }
            ].map((cat, idx) => (
              <Card key={idx} className="group relative overflow-hidden h-[400px] rounded-3xl border-none shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <Image 
                  src={`https://picsum.photos/seed/cat-${idx}/600/800`}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={cat.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{cat.title}</h3>
                  <Link href="/products" className="inline-flex items-center text-xs font-black text-primary uppercase tracking-widest hover:translate-x-2 transition-transform">
                    Discover Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Today's Deals Section */}
          <section className="mt-24 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Today's Deals</h2>
                <p className="text-slate-500 font-medium">Limited time offers on world-class products.</p>
              </div>
              <Button variant="ghost" asChild className="font-black uppercase tracking-widest text-[10px] hover:text-primary">
                <Link href="/products">View All Listings</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {deals.slice(0, 4).map((product: any) => (
                <Card 
                  key={product.id} 
                  className="group relative flex flex-col border-none bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#cc0c39] text-white font-black uppercase text-[9px] tracking-widest px-3 py-1.5 border-none">
                        - {Math.round((1 - product.price / (product.originalPrice || product.price * 1.2)) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.rating} Rating</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                      <Button 
                        size="icon"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="h-12 w-12 rounded-2xl amazon-btn-primary"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter">Z-MART</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Redefining e-commerce with a focus on quality, speed, and premium user experience.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-slate-500">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/products" className="hover:text-primary transition-colors">Our Catalog</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">Your Orders</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Merchant Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">© 2024 Z-MART GLOBAL • ALL RIGHTS RESERVED</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
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