
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format, addDays } from "date-fns";
import { Package, MapPin, CreditCard, Calendar, ShoppingBag, QrCode } from "lucide-react";
import Image from "next/image";

interface ReceiptModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  if (!order) return null;

  const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
  const deliveryDate = addDays(orderDate, 4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-visible [&>button]:text-white [&>button]:bg-slate-900/40 [&>button]:backdrop-blur-md [&>button]:rounded-full [&>button]:h-10 [&>button]:w-10 [&>button]:right-4 [&>button]:top-4 [&>button]:border [&>button]:border-white/20 [&>button]:z-50 [&>button]:transition-all [&>button]:hover:bg-slate-900 [&>button]:hover:scale-110">
        <DialogHeader className="sr-only">
          <DialogTitle>Order Receipt - #{order.id?.slice(-8).toUpperCase()}</DialogTitle>
        </DialogHeader>
        
        <div className="w-full bg-white relative rounded-[2.5rem] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] mx-4">
          <div className="overflow-y-auto max-h-[85vh] no-scrollbar flex flex-col">
            {/* Top Brand Section */}
            <div className="bg-slate-900 p-10 text-center space-y-2 relative shrink-0">
               <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-50" />
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase relative z-10">Z-MART</h2>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] relative z-10">Official Receipt</p>
            </div>

            {/* Receipt Body */}
            <div className="p-8 space-y-8 bg-white flex-1">
               {/* Order Info */}
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
                    <p className="text-sm font-black text-slate-900">#{order.id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</p>
                    <p className="text-sm font-black text-slate-900">{format(orderDate, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
               </div>

               <Separator className="bg-slate-100" />

               {/* Items Section */}
               <div className="space-y-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Purchased Items</p>
                  <div className="space-y-5">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="h-14 w-14 bg-slate-50 rounded-2xl border border-slate-100 p-2 shrink-0 relative overflow-hidden shadow-sm">
                          <Image src={item.imageUrl || 'https://placehold.co/100x100'} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
               </div>

               <Separator className="bg-slate-100" />

               {/* Delivery & Payment Details */}
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-primary" />
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</p>
                     </div>
                     <p className="text-[11px] font-black text-slate-900 uppercase">{format(deliveryDate, 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="space-y-3 text-right">
                     <div className="flex items-center gap-2 justify-end">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                       <CreditCard className="h-4 w-4 text-primary" />
                     </div>
                     <p className="text-[11px] font-black text-slate-900 uppercase">{order.paymentMethod}</p>
                  </div>
               </div>

               {/* Totals */}
               <div className="pt-8 border-t-2 border-dashed border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span>{formatCurrency(order.totalAmount - (order.totalAmount < 2000 ? 99 : 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Delivery Fee</span>
                     <span className={order.totalAmount >= 2000 ? 'text-green-500' : ''}>
                      {order.totalAmount >= 2000 ? 'FREE' : formatCurrency(99)}
                     </span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                     <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Grand Total</span>
                     <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{formatCurrency(order.totalAmount)}</span>
                  </div>
               </div>
            </div>

            {/* Bottom Barcode Section */}
            <div className="bg-slate-50 p-10 flex flex-col items-center gap-6 border-t-2 border-dashed border-white shrink-0">
               <div className="flex flex-col items-center gap-3 opacity-25">
                  <div className="flex items-center gap-[2px]">
                     {[2, 1, 4, 3, 2, 6, 1, 3, 5, 2, 4, 1, 2, 4, 2, 6, 2, 3, 1].map((w, i) => (
                        <div key={i} className="bg-black" style={{ width: `${w}px`, height: '50px' }} />
                     ))}
                  </div>
                  <p className="text-[9px] font-black tracking-[0.6em] text-black">ZMRT-{order.id?.slice(0, 10).toUpperCase()}</p>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center leading-relaxed">
                 Thank you for choosing Z-MART<br/>Global Premium Logistics
               </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
