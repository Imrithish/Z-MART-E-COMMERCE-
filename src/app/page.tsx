import { Navbar } from "@/components/storefront/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Star, Truck, ShieldCheck, Clock, ChevronRight, Zap, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const deals = MOCK_PRODUCTS.filter(p => p.isDeal);
  const featured = MOCK_PRODUCTS.filter(p => !p.isDeal).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[450px] md:h-[600px] bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/hero-market/1600/900"
              alt="Background"
              fill
              className="object-cover opacity-40"
              priority
              data-ai-hint="warehouse logistics"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 h-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 py-12">
            <div className="flex-1 space-y-8 text-center md:text-left max-w-2xl">
              <div className="space-y-4">
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-5 py-1.5 text-xs font-black uppercase tracking-widest shadow-lg animate-bounce">
                  Limited Time Offers
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                  Unbeatable Deals on <span className="text-secondary">Top Brands</span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-xl mx-auto md:mx-0">
                  Save big on electronics, essentials, and fashion. Fast delivery guaranteed to your doorstep.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform" asChild>
                  <Link href="/products">Shop the Sale <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-full bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white transition-all backdrop-blur-md">
                  Browse Categories
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-1 justify-end">
              <div className="relative w-[450px] aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white/10">
                <Image 
                  src="https://picsum.photos/seed/zmart-hero/800/800"
                  alt="Featured Product"
                  fill
                  className="object-cover"
                  data-ai-hint="premium headphones"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">Editors Choice</p>
                      <h4 className="text-slate-900 font-black text-xl leading-tight">Elite Series Pro Wireless</h4>
                    </div>
                    <Badge variant="destructive" className="h-8 w-12 flex items-center justify-center font-black rounded-xl">-50%</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400 line-through font-bold">$399.99</span>
                      <span className="text-3xl font-black text-slate-900">$199.99</span>
                    </div>
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-900 hover:bg-primary transition-colors">
                      <ShoppingBag className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Carousel */}
        <section className="bg-white border-b overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between gap-8 md:gap-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
              {[
                { name: 'Electronics', icon: Zap, color: 'bg-blue-50 text-blue-600' },
                { name: 'Fashion', icon: ShoppingBag, color: 'bg-pink-50 text-pink-600' },
                { name: 'Home Goods', icon: Clock, color: 'bg-green-50 text-green-600' },
                { name: 'Beauty', icon: Zap, color: 'bg-purple-50 text-purple-600' },
                { name: 'Groceries', icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
                { name: 'Toys', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
                { name: 'Sports', icon: Zap, color: 'bg-red-50 text-red-600' },
                { name: 'Books', icon: Zap, color: 'bg-indigo-50 text-indigo-600' }
              ].map((cat) => (
                <Link key={cat.name} href={`/products?category=${cat.name}`} className="group flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] shrink-0">
                  <div className={`h-16 w-16 md:h-20 md:w-20 rounded-3xl ${cat.color} flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}>
                    <cat.icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-widest text-center">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white p-2 rounded-xl shadow-lg shadow-red-200">
                  <Clock className="h-6 w-6 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Flash Sales</h2>
              </div>
              <p className="text-slate-500 font-medium">Top picks with extreme discounts. Ends in <span className="text-red-600 font-black">04:22:15</span></p>
            </div>
            <Link href="/products" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all group px-4 py-2 rounded-xl hover:bg-primary/5">
              Explore All Deals <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deals.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-[2rem] flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-slate-50 shrink-0">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="electronic gadget"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-600 hover:bg-red-700 font-black px-3 py-1 text-xs">
                      -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-6 space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category}</p>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-700">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-slate-400 line-through font-bold">${product.originalPrice?.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6">
                  <Button className="w-full rounded-2xl bg-slate-900 hover:bg-primary font-black py-6 transition-all active:scale-95">
                    Quick Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="bg-primary rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-white relative overflow-hidden shadow-3xl shadow-primary/20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="space-y-6 relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">Become a <span className="text-secondary">VIP Member</span></h2>
              <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed">
                Enjoy zero delivery fees on all orders, early access to new product drops, and 5% cashback on every purchase.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-black rounded-2xl px-12 h-14 shadow-xl active:scale-95 transition-all">Start Your Free Trial</Button>
            </div>
            
            <div className="relative w-full md:w-2/5 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
              <Image 
                src="https://picsum.photos/seed/market-promo/800/600" 
                alt="Promo" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                data-ai-hint="happy delivery"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Trust Factors */}
        <section className="py-24 bg-white border-y">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
              {[
                { icon: Truck, title: "Express Shipping", desc: "Delivery in 24-48 hours", color: "bg-blue-50 text-blue-600" },
                { icon: ShieldCheck, title: "Secure Checkout", desc: "Military-grade encryption", color: "bg-green-50 text-green-600" },
                { icon: Zap, title: "Best Price", desc: "We match competitor pricing", color: "bg-orange-50 text-orange-600" },
                { icon: Clock, title: "24/7 Support", desc: "Human assistance anytime", color: "bg-purple-50 text-purple-600" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                  <div className={`h-20 w-20 ${item.color} rounded-[2rem] flex items-center justify-center mb-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300`}>
                    <item.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[180px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-300 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
          <div className="space-y-8">
            <h4 className="text-4xl font-black text-white tracking-tighter">Z-MART</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Global marketplace providing top-tier products with unbeatable logistics. Join millions of satisfied customers today.
            </p>
            <div className="flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-white/10" />
               ))}
            </div>
          </div>
          
          {[
            { 
              title: "Shop Categories", 
              links: ["Electronics & Gadgets", "Home & Kitchen", "Fashion & Apparel", "Beauty & Care", "Sports & Outdoors"] 
            },
            { 
              title: "Customer Service", 
              links: ["Track Your Order", "Shipping Policy", "Return Center", "FAQ / Help", "Contact Support"] 
            }
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h5 className="font-black text-white text-lg uppercase tracking-widest">{col.title}</h5>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm font-medium hover:text-secondary transition-colors inline-block">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-8">
            <h5 className="font-black text-white text-lg uppercase tracking-widest">Newsletter</h5>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">Subscribe to get exclusive member-only deals and early launch info.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary transition-all" 
              />
              <Button className="w-full h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black rounded-2xl transition-transform active:scale-95">Subscribe Now</Button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <p>© 2024 Z-MART CORPORATION. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
