"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { Star, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { ToastAction } from "@/components/ui/toast";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deals = MOCK_PRODUCTS.filter(p => p.isDeal);

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
  
  const amazonGridItems = [
    { title: "Gaming accessories", items: ["Headsets", "Keyboards", "Mice", "Chairs"], type: "quad" },
    { title: "Deal of the Day", item: MOCK_PRODUCTS[0], type: "single" },
    { title: "Health & Personal Care", items: ["Skincare", "Oral Care", "Haircare", "Grooming"], type: "quad" },
    { title: "Sign in for the best experience", type: "auth" },
    { title: "Explore Best Sellers", item: MOCK_PRODUCTS[7], type: "single" },
    { title: "Laptops for every need", item: MOCK_PRODUCTS[9], type: "single" },
    { title: "Refresh your space", items: ["Kitchen", "Dining", "Bedroom", "Living"], type: "quad" },
    { title: "Latest Smartphone Deals", item: MOCK_PRODUCTS[2], type: "single" }
  ];

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src="https://picsum.photos/seed/amz-hero-main/1500/600"
              alt="Amazon Style Banner"
              fill
              className="object-cover"
              priority
              data-ai-hint="electronics warehouse"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#eaeded] pointer-events-none" />
          </div>
          
          <button className="absolute left-0 top-0 h-[300px] w-20 flex items-center justify-center hover:ring-2 hover:ring-white transition-all z-20">
            <ChevronLeft className="h-12 w-12 text-black/50" />
          </button>
          <button className="absolute right-0 top-0 h-[300px] w-20 flex items-center justify-center hover:ring-2 hover:ring-white transition-all z-20">
            <ChevronRight className="h-12 w-12 text-black/50" />
          </button>
        </section>

        {/* Main Content Grid - Overlapping the Hero */}
        <div className="max-w-[1500px] mx-auto px-4 -mt-[320px] relative z-30 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
            {amazonGridItems.map((gridItem, idx) => (
              <div key={idx} className="bg-white p-5 shadow-sm border border-slate-100 flex flex-col min-h-[420px] relative">
                <h2 className="text-xl font-bold mb-4 text-slate-900 leading-tight h-[56px] flex items-center">{gridItem.title}</h2>
                
                <div className="flex-1 flex flex-col mb-10">
                  {gridItem.type === 'quad' && (
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {gridItem.items?.map((sub, i) => (
                        <div key={i} className="flex flex-col gap-1 group cursor-pointer">
                          <div className="relative aspect-square bg-slate-50 overflow-hidden rounded-sm">
                            <Image 
                              src={`https://picsum.photos/seed/quad-${idx}-${i}/300/300`} 
                              alt={sub} 
                              fill 
                              className="object-cover transition-transform group-hover:scale-105" 
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-700 truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {gridItem.type === 'single' && gridItem.item && (
                    <div 
                      className="group cursor-pointer flex-1 flex flex-col" 
                      onClick={() => handleProductClick(gridItem.item as Product)}
                    >
                      <div className="relative aspect-[4/3] mb-4 bg-slate-50 overflow-hidden flex-1 max-h-[220px] rounded-sm">
                        <Image 
                          src={gridItem.item.imageUrl} 
                          alt={gridItem.item.name} 
                          fill 
                          className="object-contain p-4 transition-transform group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-1 rounded-sm">Up to 40% off</span>
                        <span className="text-[#cc0c39] text-[10px] font-bold uppercase">Deal</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 leading-snug mb-3">{gridItem.item.name}</p>
                      <button 
                        onClick={(e) => handleAddToCart(e, gridItem.item)}
                        className="amazon-btn-primary w-full text-xs h-9 mt-auto"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}

                  {gridItem.type === 'auth' && (
                    <div className="flex flex-col gap-5 py-2 flex-1">
                      <p className="text-sm text-slate-600 leading-relaxed">Sign in for the best experience and personalized results.</p>
                      <Link href="/admin/login">
                        <button className="amazon-btn-primary w-full text-sm h-11">Sign in securely</button>
                      </Link>
                      <div className="bg-slate-50 p-4 rounded-xl mt-auto border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">New customer?</p>
                        <Link href="/admin/login" className="text-xs text-primary hover:underline font-bold">Start here.</Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-5 left-5">
                   <Link href="/products" className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline block">
                    {gridItem.type === 'auth' ? 'See more' : 'Shop now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Deals Scroller */}
          <section className="bg-white p-6 mt-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Today's Deals</h2>
              <Link href="/products" className="text-sm font-bold text-[#007185] hover:text-[#c45500] hover:underline">
                See all deals
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 items-stretch">
              {deals.map((deal) => (
                <div 
                  key={deal.id} 
                  className="min-w-[240px] flex flex-col gap-3 group cursor-pointer border border-transparent hover:border-slate-100 p-2 rounded-sm transition-all"
                  onClick={() => handleProductClick(deal)}
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden rounded-sm border border-slate-100">
                    <Image src={deal.imageUrl} alt={deal.name} fill className="object-contain p-6 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                        {Math.round((1 - deal.price / (deal.originalPrice || deal.price)) * 100)}% off
                      </span>
                      <span className="text-[#cc0c39] text-[10px] font-bold uppercase tracking-tighter">Limited time deal</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-slate-900">{formatCurrency(deal.price)}</span>
                      {deal.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-medium">M.R.P: {formatCurrency(deal.originalPrice)}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed h-[32px]">{deal.name}</p>
                    <button 
                      onClick={(e) => handleAddToCart(e, deal)}
                      className="amazon-btn-primary w-full text-[11px] h-8 rounded-md mt-auto"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Secondary Carousel - Best Sellers */}
          <section className="bg-white p-6 mt-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Best Sellers in Electronics</h2>
              <Link href="/products?category=Electronics" className="text-sm font-bold text-[#007185] hover:text-[#c45500] hover:underline">
                See more
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6">
              {MOCK_PRODUCTS.filter(p => p.category === 'Electronics').map((product) => (
                <div 
                  key={product.id} 
                  className="min-w-[180px] group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-square bg-white rounded-sm mb-3">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`h-2.5 w-2.5 ${i <= Math.floor(product.rating) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-200'}`} />)}
                    </div>
                    <span className="text-[10px] text-[#007185]">{product.reviews.toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(product.price)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Back to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-sm font-bold py-4 transition-colors tracking-wide mt-10"
        >
          Back to top
        </button>

        {/* Amazon Style Footer */}
        <footer className="bg-[#232f3e] text-white pt-12 pb-16">
          <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold text-base">Get to Know Us</h4>
              <ul className="text-sm space-y-2.5 text-slate-300 font-medium">
                <li><Link href="#" className="hover:underline">Careers</Link></li>
                <li><Link href="#" className="hover:underline">Blog</Link></li>
                <li><Link href="#" className="hover:underline">About Z-Mart</Link></li>
                <li><Link href="#" className="hover:underline">Sustainability</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-base">Make Money with Us</h4>
              <ul className="text-sm space-y-2.5 text-slate-300 font-medium">
                <li><Link href="/admin/login" className="hover:underline">Sell products on Z-Mart</Link></li>
                <li><Link href="#" className="hover:underline">Sell on Z-Mart Business</Link></li>
                <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
                <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-base">Z-Mart Payment</h4>
              <ul className="text-sm space-y-2.5 text-slate-300 font-medium">
                <li><Link href="#" className="hover:underline">Z-Mart Business Card</Link></li>
                <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
                <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
                <li><Link href="#" className="hover:underline">Currency Converter</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-base">Let Us Help You</h4>
              <ul className="text-sm space-y-2.5 text-slate-300 font-medium">
                <li><Link href="#" className="hover:underline">Your Account</Link></li>
                <li><Link href="#" className="hover:underline">Your Orders</Link></li>
                <li><Link href="#" className="hover:underline">Shipping Rates</Link></li>
                <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
                <li><Link href="#" className="hover:underline">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1000px] mx-auto px-6 mt-16 pt-10 border-t border-slate-700 flex flex-col items-center gap-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-black tracking-tighter hover:text-primary transition-colors">Z-MART</Link>
              <div className="border border-slate-500 rounded-sm px-3 py-1.5 flex items-center gap-2 text-xs text-slate-300">
                <span>English</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <Link href="#" className="hover:underline">Conditions of Use</Link>
              <Link href="#" className="hover:underline">Privacy Notice</Link>
              <Link href="#" className="hover:underline">Your Ads Privacy Choices</Link>
            </div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">© 1996-2024, Z-Mart.in, Inc. or its affiliates</p>
          </div>
        </footer>
      </main>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
