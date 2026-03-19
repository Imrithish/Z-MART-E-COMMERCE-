import { Navbar } from "@/components/storefront/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ArrowRight, Star, Truck, ShieldCheck, CreditCard, Clock, ChevronRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const deals = MOCK_PRODUCTS.filter(p => p.isDeal);
  const featured = MOCK_PRODUCTS.filter(p => !p.isDeal).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Marketplace Style */}
        <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="https://picsum.photos/seed/hero-market/1600/800"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-white space-y-6 max-w-xl text-center md:text-left">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-1 text-sm font-bold uppercase tracking-wider">
                Big Summer Sale
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Don't Miss Out on <span className="text-secondary">Epic Deals</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 font-medium">
                Up to 70% off on electronics, home goods, and fashion. Only for a limited time.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Button size="lg" className="h-12 px-10 text-lg rounded-full shadow-xl shadow-blue-900/40" asChild>
                  <Link href="/products">Shop Deals</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-10 text-lg rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                  New Arrivals
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative w-[400px] h-[400px] rounded-3xl overflow-hidden shadow-2xl rotate-3">
              <Image 
                src="https://picsum.photos/seed/hero-prod/600/600"
                alt="Featured Product"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                <p className="text-primary text-xs font-bold uppercase">Must-have item</p>
                <h4 className="text-slate-900 font-bold text-lg">Pro Wireless Audio</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-slate-900">$149.99</span>
                  <Badge variant="destructive" className="rounded-md">50% OFF</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Quick Nav */}
        <section className="py-12 bg-white border-b overflow-x-auto scrollbar-hide">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-8 min-w-max">
              {['Electronics', 'Fashion', 'Home & Kitchen', 'Mobile Phones', 'Beauty', 'Toys', 'Books', 'Furniture'].map((cat) => (
                <Link key={cat} href={`/products?category=${cat}`} className="group flex flex-col items-center gap-3">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary/10">
                    <Zap className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-700 group-hover:text-primary">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Deals Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  Flash Sales 
                  <span className="text-red-600 text-sm font-bold ml-2">ENDS IN 12:45:00</span>
                </h2>
                <p className="text-slate-500 text-sm">Grab them before they are gone!</p>
              </div>
            </div>
            <Link href="/products" className="text-primary font-bold flex items-center gap-1 hover:underline">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 hover:bg-red-700">
                      -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4 space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{product.category}</p>
                  <CardTitle className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">({product.reviews})</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-slate-400 line-through">${product.originalPrice?.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 font-bold">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-secondary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-secondary-foreground relative overflow-hidden">
            <div className="space-y-4 relative z-10 max-w-lg text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black">Join our Rewards Club</h2>
              <p className="text-lg font-medium opacity-90">Get exclusive member discounts, free shipping on all orders, and early access to sales.</p>
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8">Sign Up for Free</Button>
            </div>
            <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://picsum.photos/seed/market-promo/600/600" alt="Promo" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Best Sellers</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
              <p className="text-slate-500 max-w-xl">Our most popular items loved by thousands of customers worldwide.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((product) => (
                <Card key={product.id} className="group border-none shadow-md hover:shadow-xl transition-all rounded-2xl bg-white overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image 
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-5">
                    <Badge variant="outline" className="w-fit mb-2 text-[10px] uppercase font-bold tracking-wider">{product.category}</Badge>
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2 min-h-[3.5rem] leading-tight">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex text-yellow-500">
                         <Star className="h-4 w-4 fill-current" />
                      </div>
                      <span className="text-sm font-black text-slate-900">{product.rating}</span>
                      <span className="text-xs text-slate-400">({product.reviews} reviews)</span>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-5 pt-0 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <Button size="sm" className="rounded-full px-5">Buy Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Factors */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-blue-50 text-primary rounded-full flex items-center justify-center shadow-inner">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Fast & Free Shipping</h3>
                <p className="text-slate-500 text-sm">On all orders over $99. Delivering to your door in 2-3 days.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Secure Payments</h3>
                <p className="text-slate-500 text-sm">100% secure checkout with multiple payment options including EMI.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shadow-inner">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Instant Support</h3>
                <p className="text-slate-500 text-sm">Dedicated 24/7 customer service via chat and phone.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shadow-inner">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">7-Day Returns</h3>
                <p className="text-slate-500 text-sm">Not satisfied? Return any item within 7 days for a full refund.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h4 className="text-3xl font-black text-white tracking-tighter">Z-MART</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your one-stop destination for everything you need. Quality products, unbeatable prices, and exceptional service since 2024.
            </p>
            <div className="flex gap-4">
               <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer" />
               <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer" />
               <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer" />
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold text-white text-lg">Shop by Category</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-secondary transition-colors">Electronics & Gadgets</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Home & Kitchen Essentials</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Beauty & Personal Care</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Books & Media</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold text-white text-lg">Customer Service</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-secondary transition-colors">Track Your Order</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Help Center / FAQs</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold text-white text-lg">Newsletter</h5>
            <p className="text-sm text-slate-400">Subscribe to receive updates on new arrivals and special offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-secondary" />
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Join</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 Z-MART Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Use</Link>
            <Link href="#" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}