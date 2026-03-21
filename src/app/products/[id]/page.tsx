"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Info, CheckCircle2, Zap, AlignLeft, ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, limit, orderBy } from "firebase/firestore";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();

  const { data: productData, loading } = useDoc(db ? doc(db, 'products', params.id) : null);
  const product = productData as Product | undefined;

  const suggestionsQuery = db ? query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10)) : null;
  const { data: suggestedProducts } = useCollection(suggestionsQuery);
  const filteredSuggestions = suggestedProducts ? suggestedProducts.filter((p: any) => p.id !== product?.id).slice(0, 6) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col pt-16 items-center justify-center bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col pt-16 bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Product Not Found</h2>
          <Button asChild className="rounded-none bg-slate-900 font-bold uppercase tracking-widest text-xs">
            <Link href="/products">Back to Store</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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
          <div className="relative h-12 w-12 rounded-none bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
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
          <Link href="/cart" className="amazon-btn-primary text-[10px] px-4 py-2 rounded-none">
            View Cart
          </Link>
        </ToastAction>
      ),
    });
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
    router.push(`/checkout?productId=${product.id}`);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Back Navigation Bar */}
      <div className="w-full bg-white border-b border-t border-slate-200 px-4 md:px-12 py-3 flex items-center shadow-sm sticky top-[105px] z-40">
        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>

      <div className="flex-1 w-full max-w-[1600px] mx-auto bg-white flex flex-col md:flex-row shadow-sm min-h-[calc(100vh-160px)]">

        {/* Left: Image Section */}
        <div className="w-full md:w-1/2 bg-[#f7f8f8] p-8 md:p-16 flex items-center justify-center relative border-r border-slate-100">
          <div className="relative w-full aspect-square max-w-[600px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
          {product.isDeal && (
            <Badge className="absolute top-8 left-8 md:top-12 md:left-12 bg-[#cc0c39] text-white font-black uppercase md:text-xs text-[10px] tracking-widest px-4 py-2 border-none rounded-none shadow-xl">
              Limited Time Deal
            </Badge>
          )}
        </div>

        {/* Right: Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col relative bg-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-sm font-bold uppercase tracking-wider">
              Visit the {product.brand || "Z-MART"} Store
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 py-4 border-b border-t border-slate-100 mb-8">
            <div className="flex items-center gap-1">
              <span className="text-sm md:text-base font-bold mr-2">{product.rating || 0}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 md:h-5 md:w-5 ${i <= Math.floor(product.rating || 0) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-slate-200'}`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[#007185] text-sm hover:text-[#c45500] cursor-pointer font-bold">{(product.reviews || 0).toLocaleString()} ratings</span>
          </div>

          <div className="space-y-10 flex-1">
            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-end gap-4">
                {discountPercentage > 0 && (
                  <span className="text-4xl md:text-5xl font-light text-[#cc0c39]">-{discountPercentage}%</span>
                )}
                <div className="flex items-start">
                  <span className="text-xl md:text-2xl font-bold mt-1 md:mt-2 text-slate-900">₹</span>
                  <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">{(product.price || 0).toLocaleString()}</span>
                </div>
              </div>
              {product.originalPrice && (
                <p className="text-base text-slate-500 font-medium">
                  M.R.P.: <span className="line-through">{formatCurrency(product.originalPrice)}</span>
                </p>
              )}
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Inclusive of all taxes</p>
            </div>

            {/* Purchase Options */}
            <div className="bg-[#fcfcfc] border-2 border-slate-100 rounded-none p-6 md:p-8 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-600"><span className="font-bold text-slate-900 block">FREE delivery</span> by Tomorrow, 11 AM</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-xs text-[#007185] font-bold">10 days Returnable</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-xs text-[#007185] font-bold">Secure transaction</p>
                </div>
              </div>

              <div className="h-px bg-slate-200 w-full my-6" />

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 md:h-16 text-sm md:text-base bg-[#ffd814] hover:bg-[#f7ca00] text-black border-[#fcd200] border shadow-md rounded-none font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 duration-300"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" /> Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="w-full h-14 md:h-16 text-sm md:text-base bg-[#ffa41c] hover:bg-[#fa8900] text-black border-[#ff8f00] border shadow-md rounded-none font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 duration-300"
                >
                  <Zap className="h-5 w-5 mr-3" /> Buy Now
                </Button>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-900">
                <AlignLeft className="h-5 w-5 text-slate-400" />
                <h4 className="font-black tracking-tight text-xl uppercase">Description</h4>
              </div>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {product.description || "Premium quality item curated for Z-MART. Carefully packaged and strictly inspected for the highest customer satisfaction."}
              </p>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="font-black text-slate-900 tracking-tight text-xl uppercase">Key Features</h4>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-base text-slate-700 font-medium flex gap-3">
                      <span className="text-[#007185] font-black">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Extra Info */}
            <div className="mt-auto pt-10 pb-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center justify-between">
              <span>SKU / Product code: {product.id}</span>
              <span>Authentic Z-Mart Merchandise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Widget */}
      {filteredSuggestions.length > 0 && (
        <div className="w-full max-w-[1600px] mx-auto bg-white border-t border-slate-200 p-8 md:p-12 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#c45500] uppercase tracking-tighter flex items-center gap-2">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              Customers who viewed this item also viewed
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
            {filteredSuggestions.map((item: any) => (
              <div key={item.id} onClick={() => router.push(`/products/${item.id}`)} className="snap-start shrink-0 w-[180px] md:w-[220px] flex flex-col group cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-lg p-3 transition-all duration-300">
                <div className="relative aspect-square w-full bg-white mb-4 flex items-center justify-center">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain mix-blend-multiply p-2 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-[11px] md:text-xs font-extrabold text-[#007185] group-hover:text-[#c45500] line-clamp-3 leading-tight uppercase tracking-tight mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-2.5 w-2.5 ${i <= Math.floor(item.rating || 0) ? 'fill-[#ffa41c] text-[#ffa41c]' : 'text-slate-200'}`} />)}
                  </div>
                  <span className="text-[#007185] text-[9px] font-bold">{(item.reviews || 0).toLocaleString()}</span>
                </div>
                <div className="mt-auto flex items-start">
                  <span className="text-[10px] font-medium mt-0.5">₹</span>
                  <span className="text-lg md:text-xl font-black text-[#B12704]">{item.price.toLocaleString()}</span>
                </div>
                {item.isDeal && (
                  <span className="mt-2 text-[9px] font-black uppercase text-white bg-[#cc0c39] px-2 py-0.5 self-start tracking-widest">Deal</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
