"use client"

import Link from "next/link";
import { ShoppingCart, User, Search, Home, LogOut, ShieldCheck, ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

const SEARCH_CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Books"
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { totalItems } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("q", searchQuery.trim());
    if (selectedCategory !== "All Categories") params.append("category", selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-xl">
      {/* Primary Header */}
      <div className="amazon-header-bg text-white h-[65px] flex items-center px-4 md:px-6 gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <span className="text-2xl md:text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">Z-MART</span>
          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-3 ml-1" />
        </Link>

        {/* Location (Amazon Style) */}
        <div className="hidden lg:flex flex-col items-start leading-tight hover:ring-1 hover:ring-white p-2 rounded-sm cursor-pointer transition-all">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deliver to</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-tight">Select Location</span>
          </div>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="flex flex-1 items-center h-10 rounded-md overflow-hidden bg-white group focus-within:ring-2 focus-within:ring-primary"
        >
          <div className="h-full border-r border-slate-200 hidden md:block">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-full border-none bg-slate-50 focus:ring-0 text-[10px] text-slate-600 px-4 gap-2 rounded-none shadow-none font-black uppercase tracking-widest">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-2">
                {SEARCH_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-[10px] py-3 cursor-pointer font-black uppercase tracking-widest rounded-lg">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input 
            placeholder="Search Z-MART products..." 
            className="flex-1 border-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 h-full rounded-none px-4 font-bold text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="h-full bg-primary hover:bg-primary/90 px-5 transition-all shrink-0">
            <Search className="h-5 w-5 text-slate-900" />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="group relative">
            <button className="flex flex-col items-start leading-tight hover:ring-1 hover:ring-white p-2 rounded-sm transition-all text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {user ? `Hello, ${user.displayName?.split(' ')[0]}` : 'Sign In'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black uppercase tracking-tight">Account & Lists</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-[calc(100%+0px)] right-0 w-64 bg-white text-slate-900 shadow-2xl rounded-none p-6 hidden group-hover:block border border-slate-100 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
              {user ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Account</p>
                    <p className="text-sm font-black truncate">{user.email}</p>
                  </div>
                  <Separator />
                  <ul className="space-y-2">
                    <li><Link href="/account" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest transition-all">Your Profile</Link></li>
                    <li><Link href="/account#orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest transition-all">Your Orders</Link></li>
                    <li><Link href="/admin/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest text-primary">Merchant Hub</Link></li>
                  </ul>
                  <Separator />
                  <Button onClick={handleSignOut} variant="destructive" className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/10">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <Button asChild className="amazon-btn-primary w-full h-12 rounded-xl">
                    <Link href="/login">Sign In Securely</Link>
                  </Button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    New? <Link href="/signup" className="text-primary hover:underline">Start Here</Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link href="/cart" className="flex items-end gap-1 hover:ring-1 hover:ring-white p-2 rounded-sm transition-all group">
            <div className="relative">
              <ShoppingCart className="h-7 w-7 text-white" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-5 w-5 text-primary text-[12px] font-black flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <span className="hidden md:block text-xs font-black uppercase tracking-tight mt-auto pb-0.5">Cart</span>
          </Link>
        </div>
      </div>

      {/* Amazon-Style Sub-navigation */}
      <div className="amazon-subnav-bg text-white h-[40px] flex items-center px-4 md:px-6 gap-6 overflow-x-auto no-scrollbar text-[11px] font-black uppercase tracking-widest">
        <Link href="/" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all flex items-center gap-2 shrink-0">
          <Home className="h-3 w-3" /> Home
        </Link>
        <Link href="/products?category=Electronics" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all shrink-0">Electronics</Link>
        <Link href="/products?category=Fashion" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all shrink-0">Fashion</Link>
        <Link href="/products?category=Home & Kitchen" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all shrink-0">Home Decor</Link>
        <Link href="/products" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all text-primary shrink-0">Today's Deals</Link>
        <Link href="/admin/login" className="hover:ring-1 hover:ring-white py-1 px-3 transition-all ml-auto shrink-0 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Merchant Hub
        </Link>
      </div>
    </header>
  );
}
