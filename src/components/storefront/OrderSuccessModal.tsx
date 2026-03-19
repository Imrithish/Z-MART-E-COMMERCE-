
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
}

export function OrderSuccessModal({ isOpen, onClose, orderTotal }: OrderSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[3rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
        <DialogHeader className="sr-only">
          <DialogTitle>Order Successful</DialogTitle>
        </DialogHeader>
        <div className="relative p-12 flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Celebration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
          
          {/* Confetti Particles */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: ['#ff9900', '#0f172a', '#ffd814', '#fbbf24', '#000000'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * -20}%`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0.6,
                    transform: `translateY(${Math.random() * 500}px) rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Icon with layered effects */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-[2] blur-3xl opacity-50" />
            <div className="relative h-28 w-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-6 animate-in zoom-in spin-in-12 duration-700">
              <CheckCircle2 className="h-14 w-14 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce delay-300">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="space-y-4 relative z-10 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Victory!</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Your order has been confirmed</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
              We've received your order. Our team is already picking and packing your premium Z-MART essentials.
            </p>
          </div>

          <div className="mt-10 p-8 bg-slate-50 rounded-[2.5rem] w-full border border-slate-100 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount Charged</span>
              <span className="text-2xl font-black text-slate-900">{formatCurrency(orderTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirmation</span>
              <span className="text-[9px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full uppercase tracking-widest">Secure Payment</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full mt-12 relative z-10 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-500">
            <Button asChild className="h-16 bg-slate-900 hover:bg-primary text-white hover:text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-2xl active:scale-95 transition-all group">
              <Link href="/account#orders" onClick={onClose}>
                Track My Order <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" asChild className="h-12 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 rounded-xl transition-colors">
              <Link href="/products" onClick={onClose}>Continue Shopping</Link>
            </Button>
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-10 flex items-center gap-2 opacity-50 animate-in fade-in duration-1000 delay-700">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Premium Service</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
