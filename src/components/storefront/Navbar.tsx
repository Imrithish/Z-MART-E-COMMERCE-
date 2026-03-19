"use client"

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, MapPin, ChevronDown, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Primary Header */}
      <div className="amazon-header-bg text-white h-[60px] flex items-center px-4 gap-2 md:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm transition-all">
          <span className="text-2xl font-bold tracking-tighter">Z-MART</span>
          <span className="text-[10px] mt-2 ml-0.5 text-[#ff9900]">.in</span>
        </Link>

        {/* Deliver To */}
        <button className="hidden lg:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm transition-all leading-tight">
          <span className="text-[11px] text-gray-300 ml-5 font-medium">Deliver to</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-bold">Mumbai 400001</span>
          </div>
        </button>

        {/* Search Bar */}
        <div className={`flex-1 flex items-center h-10 rounded-md overflow-hidden bg-white ${isSearchFocused ? 'ring-2 ring-[#ff9900]' : ''}`}>
          <button className="h-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 border-r flex items-center gap-1">
            All <ChevronDown className="h-3 w-3" />
          </button>
          <Input 
            placeholder="Search Z-Mart" 
            className="flex-1 border-none focus-visible:ring-0 text-black placeholder:text-gray-500 h-full rounded-none"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button className="h-full bg-[#febd69] hover:bg-[#f3a847] px-3 transition-colors">
            <Search className="h-6 w-6 text-[#131921]" />
          </button>
        </div>

        {/* Language/Flag */}
        <button className="hidden xl:flex items-center gap-1 px-2 py-2 border border-transparent hover:border-white rounded-sm transition-all">
          <Globe className="h-5 w-5" />
          <span className="text-sm font-bold">EN</span>
          <ChevronDown className="h-3 w-3 mt-1" />
        </button>

        {/* Account & Lists */}
        <Link href="/admin/login" className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm transition-all leading-tight">
          <span className="text-[11px] font-medium">Hello, sign in</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">Account & Lists</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Link>

        {/* Returns & Orders */}
        <button className="hidden md:flex flex-col items-start px-2 py-1 border border-transparent hover:border-white rounded-sm transition-all leading-tight">
          <span className="text-[11px] font-medium">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </button>

        {/* Cart */}
        <Link href="/cart" className="flex items-end px-2 py-1 border border-transparent hover:border-white rounded-sm transition-all relative">
          <div className="relative">
            <ShoppingCart className="h-8 w-8" />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] font-bold text-base">
              {totalItems}
            </span>
          </div>
          <span className="text-sm font-bold hidden sm:inline-block mb-1 ml-1">Cart</span>
        </Link>
      </div>

      {/* Secondary Navigation (Subnav) */}
      <div className="amazon-subnav-bg text-white h-[40px] flex items-center px-4 gap-4 overflow-x-auto no-scrollbar whitespace-nowrap text-sm font-medium">
        <button className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm">
          <Menu className="h-5 w-5" /> All
        </button>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Today's Deals</Link>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Customer Service</Link>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Electronics</Link>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Home & Kitchen</Link>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Gift Cards</Link>
        <Link href="#" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Sell</Link>
        <div className="flex-1" />
        <span className="hidden lg:block text-sm font-bold px-2 py-1">Shop great deals now</span>
      </div>
    </header>
  );
}
