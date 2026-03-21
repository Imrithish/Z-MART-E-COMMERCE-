
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format, addDays } from "date-fns";
import { Package, MapPin, CreditCard, Calendar, ShoppingBag, QrCode, X } from "lucide-react";
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
      <DialogContent className="w-[95vw] md:w-[80vw] max-w-4xl max-h-[85vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-visible">
        <DialogHeader className="sr-only">
          <DialogTitle>Order Receipt - #{order.id?.slice(-8).toUpperCase()}</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden h-[85vh] relative">
        {/* LEFT COLUMN: Brand */}
        <div className="w-full md:w-5/12 bg-green-500 border-r border-green-600 p-4 md:p-6 text-white relative flex flex-col shrink-0 justify-center overflow-hidden">
          <div className="relative z-10 space-y-8 flex flex-col items-center text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-white/20 scale-[2] blur-2xl opacity-50 rounded-none" />
              <div className="relative h-20 w-20 bg-white rounded-none flex items-center justify-center shadow-2xl rotate-3 animate-in zoom-in spin-in-12 duration-700">
                <ShoppingBag className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <DialogHeader className="space-y-2">
              <DialogTitle className="text-3xl md:text-4xl font-black tracking-tighter uppercase whitespace-nowrap">
                Receipt
              </DialogTitle>
              <p className="font-bold uppercase tracking-widest text-[10px] text-green-100">
                Order #{order.id?.slice(-8).toUpperCase()}
              </p>
            </DialogHeader>

            <div className="mt-6 pt-6 flex flex-col items-center gap-2 opacity-80 border-t border-green-400/50 w-full">
              <span className="text-[9px] font-black text-green-100 uppercase tracking-[0.3em] text-center">
                Z-MART Premium<br/>Fulfillment Service
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Receipt Details */}
        <div className="w-full md:w-7/12 p-4 md:p-6 flex flex-col bg-slate-50 relative z-10 overflow-y-auto">

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Order Summary</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Thank you for shopping with Z-MART. Here’s a complete breakdown of your order and payment.
            </p>
          </div>

          <div className="mt-4 p-4 bg-white rounded-none border-2 border-slate-100 shadow-sm relative">
            <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9px] px-3 py-1 font-black uppercase tracking-widest rounded-none">
              Receipt Details
            </div>

            <div className="flex justify-between items-center mb-3 pt-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Date</span>
              <span className="text-sm font-black text-slate-900">{format(orderDate, 'MMM dd, yyyy HH:mm')}</span>
            </div>
            
            <div className="h-px w-full bg-slate-100 my-3" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Calendar className="h-4 w-4" /> Est. Delivery
                </div>
                <p className="text-[11px] font-black text-slate-900 uppercase">{format(deliveryDate, 'MMM dd, yyyy')}</p>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-2 justify-end text-xs font-black text-slate-400 uppercase tracking-widest">
                  Payment <CreditCard className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-black text-slate-900 uppercase">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-6 p-4 bg-white rounded-none border-2 border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Purchased Items</p>
            <div className="space-y-5">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="h-14 w-14 bg-slate-50 rounded-none border border-slate-100 p-2 shrink-0 relative overflow-hidden shadow-sm">
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

            <div className="pt-6 border-t-2 border-dashed border-slate-100 mt-6 space-y-4">
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
              <div className="flex justify-between items-end pt-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Grand Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
