
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight, Star } from "lucide-react";
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
      const timer = setTimeout(() => setShowConfetti(false), 5000);
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
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
        <div className="relative p-10 flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Confetti Particles (Simplified CSS Animation) */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: ['#ff9900', '#232f3e', '#ffd814', '#007185'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0.6
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Icon */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50 animate-pulse" />
            <div className="relative h-24 w-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-110">
              <CheckCircle2 className="h-12 w-12 text-white animate-in zoom-in duration-500" />
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order Confirmed!</h2>
            <p className="text-slate-500 font-medium">Thank you for shopping with Z-MART. Your premium items are being prepared for dispatch.</p>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-3xl w-full border border-slate-100 relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(orderTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-tighter">Paid Successfully</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-10 relative z-10">
            <Button asChild className="h-14 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all group">
              <Link href="/account#orders" onClick={onClose}>
                Track My Order <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" asChild className="h-12 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">
              <Link href="/products" onClick={onClose}>Continue Shopping</Link>
            </Button>
          </div>

          {/* Bottom Badge */}
          <div className="mt-8 flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Premium Service Guaranteed</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
