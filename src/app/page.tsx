import { Navbar } from "@/components/storefront/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Star, Truck, ShieldCheck, Clock, ChevronRight, Zap, ArrowRight, ShoppingBag, LayoutDashboard, Settings, Package, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const deals = MOCK_PRODUCTS.filter(p => p.isDeal);
  const bestSellers = MOCK_PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[450px] md:h-[550px] bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/amazon-hero/1600/900"
              alt="Marketplace Background"
              fill
              className="object-cover opacity-60"
              priority
              data-ai-hint="shopping logistics"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 h-full relative z-10 flex items-center py-12">
            <div className="max-w-xl space-y-6 md:space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-secondary/20 text-secondary w-fit px-4 py-1.5 rounded-full border border-secondary/30 backdrop-blur-md">
                   <Zap className="h-4 w-4 fill-secondary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mega Savings Days</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                  Shop Top Brands <br />
                  <span className="text-secondary">Save Like Never Before</span>
                </h1>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  Discover millions of products across electronics, fashion, and home essentials. Fast delivery with every order.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl shadow-2xl bg-primary hover:bg-primary/90 transition-all active:scale-95" asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-xl bg-white/5 text-white border-white/20 hover:bg-white/10 transition-all backdrop-blur-md">
                  Join Prime
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="bg-white border-b shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 overflow-x-auto no-scrollbar">
           {[
             { name: 'Mobiles', icon: Zap, color: 'text-blue-500' },
             { name: 'Fashion', icon: ShoppingBag, color: 'text-pink-500' },
             { name: 'Electronics', icon: Zap, color: 'text-purple-500' },
             { name: 'Home', icon: Clock, color: 'text-orange-500' },
             { name: 'Appliances', icon: Zap, color: 'text-green-500' },
             { name: 'Travel', icon: Clock, color: 'text-red-500' },
             { name: 'Beauty', icon: Zap, color: 'text-indigo-500' }
           ].map(cat => (
             <Link key={cat.name} href={`/products?category=${cat.name}`} className="group flex flex-col items-center gap-2 shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors group-hover:scale-110">
                   <cat.icon className={`h-7 w-7 ${cat.color} group-hover:animate-pulse`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary">{cat.name}</span>
             </Link>
           ))}
        </section>

        {/* Flash Deals Section */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Today's Deals</h2>
                 <Badge className="bg-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1">Ending Soon</Badge>
               </div>
               <p className="text-slate-500 font-medium">Limited time offers you can't miss.</p>
            </div>
            <Link href="/products" className="text-primary font-black flex items-center gap-2 hover:gap-4 transition-all group text-sm">
              See all deals <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deals.slice(0, 4).map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="amazon product"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-widest">
                    Deal of the day
                  </div>
                </div>
                <CardHeader className="p-6 space-y-2 flex-grow">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{product.brand}</span>
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded-md">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 border-none" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-0 pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 line-through font-bold">${product.originalPrice?.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-widest">Inclusive of all taxes</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                  <Button className="w-full rounded-xl bg-slate-900 hover:bg-primary font-black transition-all active:scale-95 text-xs h-12">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="bg-slate-900 py-24">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                 <div className="text-center md:text-left space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase tracking-widest">Bestsellers in <span className="text-primary">Electronics</span></h2>
                    <p className="text-slate-400 font-medium text-lg">The products everyone is talking about.</p>
                 </div>
                 <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-14 px-10 transition-all active:scale-95">Shop Now</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {bestSellers.map(product => (
                    <div key={product.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group flex flex-col gap-6">
                       <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                             <BadgeCheck className="h-6 w-6" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-xl font-black text-white leading-snug line-clamp-2">{product.name}</h4>
                          <div className="flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Free Delivery</span>
                             </div>
                             <Button size="icon" className="h-14 w-14 rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white transition-all">
                                <ShoppingBag className="h-6 w-6" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Brand Trust Section */}
        <section className="py-24 max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { icon: Truck, title: "Fast Delivery", desc: "Across 20,000+ pin codes", color: "text-blue-500" },
                { icon: ShieldCheck, title: "100% Secure", desc: "Standard encryption protection", color: "text-green-500" },
                { icon: Clock, title: "7-Day Returns", desc: "Hassle-free return policy", color: "text-orange-500" },
                { icon: Zap, title: "Best Prices", desc: "Direct from top merchants", color: "text-purple-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
                   <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 group-hover:-translate-y-2 transition-all duration-300">
                      <item.icon className={`h-10 w-10 ${item.color}`} />
                   </div>
                   <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm">{item.title}</h5>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[150px]">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <h4 className="text-4xl font-black text-white tracking-tighter">Z-MART</h4>
            <p className="text-sm font-medium leading-relaxed">
              Experience the world's most customer-centric marketplace. From high-tech electronics to traditional fashion, we bring the best products to your doorstep.
            </p>
            <div className="flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-white/10" />
               ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <h5 className="font-black text-white text-lg uppercase tracking-widest">Merchant Portal</h5>
            <ul className="space-y-4">
              <li><Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard</Link></li>
              <li><Link href="/admin/products/new" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><Package className="h-4 w-4" /> Add New Product</Link></li>
              <li><Link href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><Settings className="h-4 w-4" /> Store Settings</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="font-black text-white text-lg uppercase tracking-widest">Customer Help</h5>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium hover:text-white transition-colors">Your Account</Link></li>
              <li><Link href="#" className="text-sm font-medium hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link href="#" className="text-sm font-medium hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="#" className="text-sm font-medium hover:text-white transition-colors">Shipping Rates</Link></li>
              <li><Link href="#" className="text-sm font-medium hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="font-black text-white text-lg uppercase tracking-widest">Newsletter</h5>
            <p className="text-sm font-medium leading-relaxed">Join 1M+ shoppers for early access to Prime deals and launches.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
              />
              <Button className="w-full h-14 bg-primary text-white font-black rounded-2xl transition-transform active:scale-95">Subscribe</Button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2024 Z-MART. INSPIRED BY AMAZON & FLIPKART.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
