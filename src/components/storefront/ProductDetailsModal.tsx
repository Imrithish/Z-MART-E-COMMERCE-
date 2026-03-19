
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Info, CheckCircle2, Zap, AlignLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";

interface ProductDetailsModalProps {
  product: Product | null;
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

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  if (!product) return null;

  const handleAddToCart = () => {
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
    onClose();
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use Buy Now.",
      });
      router.push('/login');
      return;
    }
    onClose();
    router.push(`/checkout?productId=${product.id}`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none rounded-[1.5rem] bg-white gap-0">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left: Image Section */}
          <div className="w-full md:w-1/2 bg-[#f7f8f8] p-8 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-[400px]">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
            {product.isDeal && (
              <Badge className="absolute top-6 left-6 bg-[#cc0c39] text-white font-black uppercase text-[10px] tracking-widest px-3 py-1.5 border-none rounded-sm">
                Limited Time Deal
              </Badge>
            )}
          </div>

          {/* Right: Details Section */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white no-scrollbar">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-sm font-bold uppercase tracking-wider">
                  Visit the {product.brand || "Z-MART"} Store
                </span>
              </div>
              <DialogTitle className="text-2xl font-medium leading-tight text-slate-900 mb-2">
                {product.name}
              </DialogTitle>
              
              <div className="flex items-center gap-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold mr-1">{product.rating || 0}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i <= Math.floor(product.rating || 0) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[#007185] text-sm hover:text-[#c45500] cursor-pointer">{(product.reviews || 0).toLocaleString()} ratings</span>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {discountPercentage > 0 && (
                    <span className="text-3xl font-light text-[#cc0c39]">-{discountPercentage}%</span>
                  )}
                  <div className="flex items-start">
                    <span className="text-sm font-medium mt-1">₹</span>
                    <span className="text-4xl font-medium">{(product.price || 0).toLocaleString()}</span>
                  </div>
                </div>
                {product.originalPrice && (
                  <p className="text-sm text-slate-500">
                    M.R.P.: <span className="line-through">{formatCurrency(product.originalPrice)}</span>
                  </p>
                )}
                <p className="text-xs text-slate-600 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Purchase Options */}
              <div className="bg-[#fcfcfc] border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Truck className="h-5 w-5 text-slate-400" />
                  <p><span className="font-bold">FREE delivery</span> by Tomorrow, 11 AM</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <RotateCcw className="h-5 w-5 text-slate-400" />
                  <p><span className="text-[#007185] font-bold">10 days Returnable</span></p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                  <p><span className="text-[#007185] font-bold">Secure transaction</span></p>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full h-12 bg-[#ffd814] hover:bg-[#f7ca00] text-black border-[#fcd200] border shadow-sm rounded-full font-bold transition-all active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="w-full h-12 bg-[#ffa41c] hover:bg-[#fa8900] text-black border-[#ff8f00] border shadow-sm rounded-full font-bold transition-all active:scale-95"
                >
                  <Zap className="h-4 w-4 mr-2" /> Buy Now
                </Button>
              </div>

              {/* Product Description Section */}
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-900">
                  <AlignLeft className="h-4 w-4 text-slate-400" />
                  <h4 className="font-bold">Description</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {product.description || "Premium quality item curated for Z-MART."}
                </p>
              </div>

              {/* Product Features Section */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-slate-300">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extra Info */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Info className="h-3 w-3" />
                <span>Product code: {product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
