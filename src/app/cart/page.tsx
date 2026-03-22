
"use client"

import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const { items, removeItem, subtotal, totalItems, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  
  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingFee = progressToFreeShipping === 100 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      });
      router.push('/login');
      return;
    }

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body">
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Shopping Basket</h1>
                <p className="text-slate-500 font-medium">You have {totalItems} items in your cart</p>
              </div>
              {items.length > 0 && (
                 <button onClick={clearCart} className="text-sm font-black text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-2">
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
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.product.id} className="group flex flex-col sm:flex-row gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all duration-300 relative border border-transparent hover:border-slate-100">
                    <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 bg-white rounded-2xl shrink-0 overflow-hidden shadow-sm border border-slate-50">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        fill 
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-2">
                        <Link href={`/products?q=${item.product.name}`} className="text-xl font-black text-slate-900 hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {item.product.name}
                        </Link>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900">
                            {formatCurrency(item.product.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 fill-current ${i > Math.floor(item.product.rating || 5) ? 'text-slate-200' : ''}`} />)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(item.product.reviews || 0)} Reviews</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 mt-auto">
                        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty:</span>
                          <span className="text-sm font-black">{item.quantity}</span>
                        </div>
                        
                        <div className="flex gap-4">
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[100px]">
            <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-100 overflow-hidden relative">
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
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
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
                      <p className="text-3xl font-black text-white">{formatCurrency(grandTotal)}</p>
                    </div>
                  </div>
                </div>

                {!user && (
                   <p className="text-[10px] font-bold text-primary text-center uppercase tracking-widest mt-4">
                     Sign in to unlock faster checkout
                   </p>
                )}

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleGoToCheckout}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
