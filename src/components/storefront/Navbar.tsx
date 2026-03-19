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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Banner/Bar (Marketplace Style) */}
      <div className="bg-slate-900 text-white text-[10px] md:text-xs py-1.5 px-4">
        <div className="container mx-auto flex justify-between items-center font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-secondary" /> Deliver to: <span className="text-secondary">New York, 10001</span></span>
            <span className="hidden sm:inline border-l border-white/20 pl-4">Free Shipping on orders over $99!</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-secondary transition-colors">Merchant Central</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Help</Link>
          </div>
        </div>
      </div>

      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-primary shrink-0">
            Z-MART
          </Link>

          {/* Mega Search Bar */}
          <div className={`hidden md:flex flex-1 relative max-w-2xl transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-primary/20 scale-[1.01]' : ''}`}>
            <div className="flex w-full items-center bg-slate-100 rounded-xl overflow-hidden group">
              <Button variant="ghost" className="rounded-none border-r bg-slate-200/50 text-xs font-bold gap-1 px-4 h-11 hidden lg:flex">
                All <ChevronDown className="h-3 w-3" />
              </Button>
              <Input 
                placeholder="Search for millions of products, brands and more..." 
                className="bg-transparent border-none h-11 focus-visible:ring-0 shadow-none px-4 text-sm font-medium placeholder:text-slate-400"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button className="h-11 px-6 rounded-none bg-primary hover:bg-primary/90 shrink-0">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-slate-100 rounded-full h-11 w-11">
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-6 w-6 text-slate-700" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-secondary text-secondary-foreground border-white">0</Badge>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative hover:bg-slate-100 rounded-full h-11 w-11">
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="h-6 w-6 text-slate-700" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary border-white">2</Badge>
              </Link>
            </Button>

            <Button variant="ghost" asChild className="hidden lg:flex items-center gap-2 hover:bg-slate-100 rounded-full px-4 h-11">
              <Link href="/admin/login">
                <div className="bg-slate-200 rounded-full p-1">
                  <User className="h-4 w-4 text-slate-700" />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hello, Guest</span>
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-12">
                   <div className="flex items-center gap-4 border-b pb-6">
                     <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                     </div>
                     <div>
                       <p className="text-lg font-black">Welcome to Z-MART</p>
                       <Link href="/admin/login" className="text-primary font-bold text-sm">Sign In / Register</Link>
                     </div>
                   </div>
                  <nav className="flex flex-col gap-4 font-bold text-slate-700">
                    <Link href="/" className="hover:text-primary py-2 text-lg">Home</Link>
                    <Link href="/products" className="hover:text-primary py-2 text-lg">Shop All Products</Link>
                    <Link href="#" className="hover:text-primary py-2 text-lg">Daily Deals</Link>
                    <Link href="#" className="hover:text-primary py-2 text-lg">Best Sellers</Link>
                    <Link href="#" className="hover:text-primary py-2 text-lg">Customer Service</Link>
                    <Link href="/admin/login" className="text-secondary py-2 text-lg">Merchant Access</Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens) */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search for products..." className="pl-10 bg-slate-100 border-none h-11 rounded-xl" />
          </div>
        </div>

        {/* Sub Navigation (Marketplace Style) */}
        <div className="hidden md:block bg-slate-50 border-t py-2 px-4">
          <div className="container mx-auto flex items-center justify-start gap-8 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Link href="#" className="flex items-center gap-1 hover:text-primary transition-colors"><Menu className="h-4 w-4" /> All Categories</Link>
            <Link href="#" className="hover:text-primary transition-colors text-red-600">Daily Deals</Link>
            <Link href="#" className="hover:text-primary transition-colors">Gift Cards</Link>
            <Link href="#" className="hover:text-primary transition-colors">New Releases</Link>
            <Link href="#" className="hover:text-primary transition-colors">Customer Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Best Sellers</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}