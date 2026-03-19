"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { useCart } from "@/context/CartContext";
import { 
  Trash2, 
  ChevronDown, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  Truck,
  Heart,
  Tag,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  
  // Free shipping logic
  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Shopping Basket</h1>
                <p className="text-slate-500 font-medium">You have {totalItems} items in your cart</p>
              </div>
              {items.length > 0 && (
                 <button className="text-sm font-black text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-2">
                    Clear Basket
                 </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="bg-slate-50 h-32 w-32 rounded-full flex items-center justify-center mb-8">
                   <ShoppingBag className="h-12 w-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3">Your basket is waiting to be filled</h2>
                <p className="text-slate-500 max-w-sm mb-10 font-medium">Items stay in your cart for a limited time, but they might sell out before you check out.</p>
                <div className="flex gap-4">
                  <Button asChild className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-xs transition-all active:scale-95 text-white">
                    <Link href="/products">Browse Trending</Link>
                  </Button>
                  <Button variant="outline" asChild className="h-14 px-8 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-xs transition-all">
                    <Link href="/">View Deals</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.product.id} className="group flex flex-col sm:flex-row gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all duration-300 relative border border-transparent hover:border-slate-100">
                    <div className="relative h-48 w-48 bg-white rounded-2xl shrink-0 overflow-hidden shadow-sm border border-slate-50">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        fill 
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.product.isDeal && (
                        <div className="absolute top-2 left-2">
                           <Badge className="bg-red-500 text-white font-black uppercase text-[8px] tracking-widest border-none">Limited Deal</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-2">
                        <Link href={`/products?q=${item.product.name}`} className="text-xl font-black text-slate-900 hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {item.product.name}
                        </Link>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900">
                            {formatCurrency(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <p className="text-xs text-slate-400 line-through font-bold">
                              {formatCurrency(item.product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 fill-current ${i > Math.floor(item.product.rating) ? 'text-slate-200' : ''}`} />)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.product.reviews} Verified Reviews</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 mt-auto">
                        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty:</span>
                          <Select 
                            value={item.quantity.toString()} 
                            onValueChange={(val) => updateQuantity(item.product.id, parseInt(val))}
                          >
                            <SelectTrigger className="border-none bg-transparent h-6 p-0 focus:ring-0 text-sm font-black w-10 shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <SelectItem key={n} value={n.toString()} className="font-bold">{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-4">
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                          
                          <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                            <Heart className="h-3 w-3" /> Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cross-sell Carousel */}
          {items.length > 0 && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-8">Recommended For You</h3>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-4">
                  {MOCK_PRODUCTS.filter(p => !items.some(i => i.product.id === p.id)).map((product) => (
                    <CarouselItem key={product.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                      <div className="group space-y-4 p-4 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm line-clamp-1 mb-1">{product.name}</h4>
                          <p className="text-lg font-black text-slate-900">{formatCurrency(product.price)}</p>
                        </div>
                        <Button variant="outline" className="w-full h-10 rounded-xl border-slate-200 font-black uppercase tracking-widest text-[9px]">Add</Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 bg-white" />
                <CarouselNext className="-right-4 bg-white" />
              </Carousel>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (4 Cols) */}
        {items.length > 0 && (
          <div className="lg:col-span-4 space-y-6 sticky top-[100px]">
            {/* Free Shipping Tracker */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${progressToFreeShipping === 100 ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
                    {progressToFreeShipping === 100 ? 'Free Shipping Unlocked!' : 'Shipping Progress'}
                  </h4>
                  {progressToFreeShipping < 100 && (
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Add {formatCurrency(remainingForFreeShipping)} more for FREE Delivery</p>
                  )}
                </div>
              </div>
              <Progress value={progressToFreeShipping} className="h-2 mb-2 bg-slate-100" />
              <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span>Basket: {formatCurrency(subtotal)}</span>
                <span>Goal: {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <ShoppingBag className="h-32 w-32 rotate-12" />
               </div>

               <div className="relative z-10 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-white/70">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-white/70">
                    <span>Shipping Fee</span>
                    <span className={progressToFreeShipping === 100 ? 'text-green-400' : 'text-white'}>
                      {progressToFreeShipping === 100 ? 'FREE' : formatCurrency(99)}
                    </span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-white/50">Grand Total</span>
                      <p className="text-3xl font-black text-white">{formatCurrency(subtotal + (progressToFreeShipping === 100 ? 0 : 99))}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                     <Gift className="h-5 w-5 text-primary shrink-0" />
                     <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-widest">Add a gift note</p>
                        <p className="text-[9px] text-white/50 font-medium">Free personalized card included</p>
                     </div>
                  </div>

                  <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all group">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
               </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <Tag className="h-5 w-5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Promo Code</span>
               </div>
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none h-12"
                  />
                  <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest h-12">Apply</Button>
               </div>
            </div>

            <div className="px-6 space-y-2">
               <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit SSL Payment</span>
               </div>
               <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                  By proceeding, you agree to Z-Mart's Terms of Use and Privacy Policy. Prices and availability are not guaranteed until checkout is complete.
               </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-white border-t border-slate-100 py-10 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 Z-MART.in • All Rights Reserved</p>
      </footer>
    </div>
  );
}
