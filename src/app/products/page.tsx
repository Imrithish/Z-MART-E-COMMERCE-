
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Card, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/mock-data";
import { Star, Loader2, ShoppingBag, Zap, Search, ChevronLeft, Filter, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useMemo, useCallback } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹20,000", min: 5000, max: 20000 },
  { label: "₹20,000 - ₹50,000", min: 20000, max: 50000 },
  { label: "Over ₹50,000", min: 50000, max: Infinity },
];

function ProductList() {
  const { addItem } = useCart();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || "All Categories";
  const searchQuery = searchParams.get('q');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("All Prices");

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allProducts, loading } = useCollection(productsQuery);

  const displayProducts = useMemo(() => {
    if (!allProducts) return [];
    let filtered = [...allProducts];

    // Category Filter
    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((p: any) => p.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q)
      );
    }

    // Price Range Filter
    const activeRange = PRICE_RANGES.find(r => r.label === priceRange);
    if (activeRange) {
      filtered = filtered.filter((p: any) => p.price >= activeRange.min && p.price <= activeRange.max);
    }

    // Sorting
    filtered.sort((a: any, b: any) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

    return filtered;
  }, [allProducts, categoryFilter, searchQuery, sortBy, priceRange]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleAddToCart = useCallback((e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addItem(product);
  }, [addItem]);

  const categories = useMemo(() => {
    if (!allProducts) return ["All Categories"];
    const cats = Array.from(new Set(allProducts.map((p: any) => p.category))).filter(Boolean);
    return ["All Categories", ...cats];
  }, [allProducts]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
            >
              <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                {categoryFilter === "All Categories" ? (searchQuery ? `Results for: ${searchQuery}` : "All Products") : categoryFilter}
              </h1>
              <div className="h-2 w-2 bg-primary rounded-full mt-2 md:mt-4" />
            </div>
            <p className="text-slate-500 font-medium text-sm md:text-lg">
              {displayProducts.length} Premium items curated for your collection.
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Refine</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={(val) => router.push(`/products?category=${val}`)}>
              <SelectTrigger className="h-10 w-[140px] md:w-[180px] border-none bg-slate-50 rounded-xl font-bold text-[10px] uppercase tracking-wider focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-[10px] font-black uppercase tracking-widest py-3">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-10 w-[140px] md:w-[180px] border-none bg-slate-50 rounded-xl font-bold text-[10px] uppercase tracking-wider focus:ring-0">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.label} value={range.label} className="text-[10px] font-black uppercase tracking-widest py-3">{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-slate-100 mx-1 hidden md:block" />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-[140px] md:w-[180px] border-none bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest focus:ring-0 group">
                <ArrowUpDown className="h-3 w-3 mr-2 text-primary" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest py-3">Newest Arrivals</SelectItem>
                <SelectItem value="price-asc" className="text-[10px] font-black uppercase tracking-widest py-3">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="text-[10px] font-black uppercase tracking-widest py-3">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="text-[10px] font-black uppercase tracking-widest py-3">Avg. Customer Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
                  {product.isDeal && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase">
                      Deal
                    </div>
                  )}
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
          <div className="col-span-full py-20 md:py-32 text-center bg-white rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
             <div className="bg-slate-50 h-20 w-20 md:h-28 md:w-28 rounded-[2rem] flex items-center justify-center mb-8 rotate-6">
                <Search className="h-10 w-10 md:h-14 md:w-14 text-slate-200" />
             </div>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">No items found</h3>
            <p className="text-xs md:text-base text-slate-400 mt-3 font-medium max-w-sm mx-auto">
              We couldn't find anything matching your current filters. Try adjusting your price range or exploring other categories.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setPriceRange("All Prices");
                setSortBy("newest");
                router.push('/products');
              }}
              className="mt-10 rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px]"
            >
              Reset Filters
            </Button>
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
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 max-w-[1450px]">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Z-MART Storefront...</p>
          </div>
        }>
          <ProductList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
