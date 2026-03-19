import { Navbar } from "@/components/storefront/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const deals = MOCK_PRODUCTS.filter(p => p.isDeal);
  
  const amazonGridItems = [
    { title: "Gaming accessories", items: ["Headsets", "Keyboards", "Mice", "Chairs"], type: "quad" },
    { title: "Deal of the Day", item: MOCK_PRODUCTS[0], type: "single" },
    { title: "Shop activity trackers", items: ["Smartwatches", "Bands"], type: "quad" },
    { title: "Sign in for the best experience", type: "auth" },
    { title: "Personal Care under $25", items: ["Grooming", "Oral Care", "Hair Care", "Skin Care"], type: "quad" },
    { title: "Laptops for every need", item: MOCK_PRODUCTS[1], type: "single" },
    { title: "Refresh your space", items: ["Kitchen", "Dining", "Bedroom", "Living"], type: "quad" },
    { title: "Deals on top brands", item: MOCK_PRODUCTS[3], type: "single" }
  ];

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src="https://picsum.photos/seed/amz-hero-main/1500/600"
              alt="Amazon Style Banner"
              fill
              className="object-cover"
              priority
              data-ai-hint="electronics warehouse"
            />
            {/* Amazon characteristic fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#eaeded] pointer-events-none" />
          </div>
          
          {/* Hero Navigation buttons */}
          <button className="absolute left-0 top-0 h-[250px] w-20 flex items-center justify-center hover:ring-2 hover:ring-white transition-all">
            <ChevronLeft className="h-12 w-12 text-black/50" />
          </button>
          <button className="absolute right-0 top-0 h-[250px] w-20 flex items-center justify-center hover:ring-2 hover:ring-white transition-all">
            <ChevronRight className="h-12 w-12 text-black/50" />
          </button>
        </section>

        {/* Main Content Grid - Overlapping the Hero */}
        <div className="max-w-[1500px] mx-auto px-4 -mt-[350px] relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {amazonGridItems.map((gridItem, idx) => (
              <div key={idx} className="amazon-card flex flex-col h-full">
                <h2 className="text-xl font-bold mb-3">{gridItem.title}</h2>
                
                <div className="flex-1">
                  {gridItem.type === 'quad' && (
                    <div className="grid grid-cols-2 gap-3">
                      {gridItem.items?.map((sub, i) => (
                        <div key={i} className="flex flex-col gap-1 group cursor-pointer">
                          <div className="relative aspect-square bg-gray-50 overflow-hidden">
                            <Image 
                              src={`https://picsum.photos/seed/${idx}-${i}/300/300`} 
                              alt={sub} 
                              fill 
                              className="object-cover transition-transform group-hover:scale-105" 
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{sub}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {gridItem.type === 'single' && gridItem.item && (
                    <Link href={`/products`} className="group block">
                      <div className="relative aspect-[4/3] mb-3 bg-gray-50 overflow-hidden">
                        <Image 
                          src={gridItem.item.imageUrl} 
                          alt={gridItem.item.name} 
                          fill 
                          className="object-contain p-4 transition-transform group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#cc0c39] text-white text-xs font-bold px-1.5 py-1 rounded-sm">Up to 40% off</span>
                        <span className="text-[#cc0c39] text-xs font-bold">Deal</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{gridItem.item.name}</p>
                    </Link>
                  )}

                  {gridItem.type === 'auth' && (
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-gray-600">Sign in for the best experience and personalized results.</p>
                      <Link href="/admin/login">
                        <button className="amazon-btn-primary w-full text-sm">Sign in securely</button>
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/products" className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline mt-4">
                  Shop now
                </Link>
              </div>
            ))}
          </div>

          {/* Horizontal Scroller Section (Today's Deals) */}
          <section className="bg-white p-5 mt-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold">Today's Deals</h2>
              <Link href="/products" className="text-sm font-medium text-[#007185] hover:text-[#c45500] hover:underline">
                See all deals
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {deals.map((deal) => (
                <div key={deal.id} className="min-w-[200px] flex flex-col gap-2 group cursor-pointer">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-sm">
                    <Image src={deal.imageUrl} alt={deal.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                      {Math.round((1 - deal.price / (deal.originalPrice || deal.price)) * 100)}% off
                    </span>
                    <span className="text-[#cc0c39] text-xs font-bold uppercase">Limited time deal</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-medium">${deal.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 line-through">List: ${deal.originalPrice?.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-1">{deal.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* More Categories / Personal Recommendations */}
          <section className="bg-white p-5 mt-5 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Inspired by your shopping trend</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {MOCK_PRODUCTS.slice(0, 6).map((product) => (
                <Link key={product.id} href="/products" className="flex flex-col gap-2 group">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4 transition-transform group-hover:scale-105" />
                  </div>
                  <p className="text-xs text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`h-3 w-3 ${i <= product.rating ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{product.reviews.toLocaleString()}</span>
                  </div>
                  <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Back to top button */}
      <button className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-sm py-4 mt-8 transition-colors">
        Back to top
      </button>

      {/* Amazon Style Footer */}
      <footer className="bg-[#232f3e] text-white pt-10 pb-16">
        <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-3">
            <h4 className="font-bold">Get to Know Us</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Blog</Link></li>
              <li><Link href="#" className="hover:underline">About Z-Mart</Link></li>
              <li><Link href="#" className="hover:underline">Sustainability</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold">Make Money with Us</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link href="/admin/login" className="hover:underline">Sell products on Z-Mart</Link></li>
              <li><Link href="#" className="hover:underline">Sell on Z-Mart Business</Link></li>
              <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link href="#" className="hover:underline">Advertise Your Products</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold">Z-Mart Payment Products</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link href="#" className="hover:underline">Z-Mart Business Card</Link></li>
              <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
              <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
              <li><Link href="#" className="hover:underline">Currency Converter</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold">Let Us Help You</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link href="#" className="hover:underline">Your Account</Link></li>
              <li><Link href="#" className="hover:underline">Your Orders</Link></li>
              <li><Link href="#" className="hover:underline">Shipping Rates</Link></li>
              <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
              <li><Link href="#" className="hover:underline">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 mt-16 pt-8 border-t border-gray-600 flex flex-col items-center gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tighter">Z-MART</Link>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-300">
            <Link href="#" className="hover:underline">Conditions of Use</Link>
            <Link href="#" className="hover:underline">Privacy Notice</Link>
            <Link href="#" className="hover:underline">Your Ads Privacy Choices</Link>
          </div>
          <p className="text-xs text-gray-400">© 1996-2024, Z-Mart.us, Inc. or its affiliates</p>
        </div>
      </footer>
    </div>
  );
}