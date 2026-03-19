"use client"

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Heart, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      {/* Top Banner (Marketplace Style) */}
      <div className="bg-slate-900 text-white text-[10px] md:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-medium">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-secondary transition-colors group">
              <MapPin className="h-3.5 w-3.5 text-secondary group-hover:scale-110 transition-transform" /> 
              <span>Deliver to <span className="text-secondary font-bold">New York 10001</span></span>
            </button>
            <span className="hidden md:inline-block border-l border-white/20 h-4 ml-2 pl-4">
              Free Shipping on orders over $99!
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-secondary transition-colors">Merchant Central</Link>
            <Link href="#" className="hover:text-secondary transition-colors hidden sm:inline-block">Customer Service</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Help</Link>
          </div>
        </div>
      </div>

      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-12">
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-primary shrink-0 transition-transform active:scale-95">
            Z-MART
          </Link>

          {/* Mega Search Bar */}
          <div className={`hidden md:flex flex-1 relative max-w-2xl transition-all duration-300 ${isSearchFocused ? 'ring-4 ring-primary/10' : ''}`}>
            <div className="flex w-full items-center bg-slate-100 rounded-xl overflow-hidden border border-transparent focus-within:border-primary/20">
              <Button variant="ghost" className="rounded-none border-r border-slate-200 bg-slate-50 text-xs font-bold gap-1 px-4 h-12 hidden lg:flex hover:bg-slate-100">
                All <ChevronDown className="h-3 w-3" />
              </Button>
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search for millions of products, brands and more..." 
                  className="bg-transparent border-none h-12 focus-visible:ring-0 shadow-none px-4 text-sm font-medium placeholder:text-slate-400 w-full"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              <Button className="h-12 px-8 rounded-none bg-primary hover:bg-primary/90 shrink-0">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-slate-100 rounded-full h-11 w-11 transition-all active:scale-90">
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5 text-slate-700" />
                <Badge className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-secondary text-secondary-foreground border-2 border-white">0</Badge>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative hover:bg-slate-100 rounded-full h-11 w-11 transition-all active:scale-90">
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                <Badge className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary border-2 border-white">2</Badge>
              </Link>
            </Button>

            <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-2" />

            <Button variant="ghost" asChild className="hidden lg:flex items-center gap-3 hover:bg-slate-100 rounded-full px-4 h-11 transition-all">
              <Link href="/admin/login">
                <div className="bg-slate-100 rounded-full p-1.5">
                  <User className="h-4 w-4 text-slate-700" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account</span>
                  <span className="text-sm font-black text-slate-900">Sign In</span>
                </div>
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-11 w-11 hover:bg-slate-100 rounded-full">
                  <Menu className="h-6 w-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="bg-slate-900 p-8 text-white">
                   <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white/10">
                        <User className="h-7 w-7" />
                     </div>
                     <div>
                       <p className="text-xl font-black">Hello!</p>
                       <Link href="/admin/login" className="text-secondary font-bold text-sm hover:underline">Sign In or Register</Link>
                     </div>
                   </div>
                </div>
                <nav className="flex flex-col p-6 gap-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Top Categories</p>
                  <Link href="/products" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-slate-700 transition-colors">Electronics</Link>
                  <Link href="/products" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-slate-700 transition-colors">Home & Kitchen</Link>
                  <Link href="/products" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-slate-700 transition-colors">Fashion</Link>
                  
                  <div className="h-px bg-slate-100 my-4" />
                  
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Settings & Help</p>
                  <Link href="/admin/login" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-primary transition-colors">Merchant Central</Link>
                  <Link href="#" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-slate-700 transition-colors">Your Orders</Link>
                  <Link href="#" className="hover:bg-slate-50 px-3 py-3 rounded-lg font-bold text-slate-700 transition-colors">Customer Service</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search for products..." 
              className="pl-11 bg-slate-100 border-none h-11 rounded-xl text-sm focus-visible:ring-primary/20" 
            />
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="hidden md:block bg-slate-50/80 border-t border-slate-100 py-2.5 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-start gap-8 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors group">
              <Menu className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" /> 
              All Categories
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <Link href="#" className="hover:text-primary transition-colors text-red-600 flex items-center gap-1">
              Daily Deals <Badge className="bg-red-600 h-4 text-[9px] px-1 hover:bg-red-700">HOT</Badge>
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">Gift Cards</Link>
            <Link href="#" className="hover:text-primary transition-colors">New Releases</Link>
            <Link href="#" className="hover:text-primary transition-colors">Z-Mart Business</Link>
            <Link href="#" className="hover:text-primary transition-colors">Customer Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Best Sellers</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
