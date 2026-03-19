"use client"

import Link from "next/link";
import { ShoppingCart, User, Search, Home, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
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
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-white h-8 flex items-center px-6 justify-between text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>Free Express Shipping over ₹2000</span>
          <span className="hidden md:block">World Class Support</span>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/login" className="text-primary hover:underline flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Merchant Center
          </Link>
        </div>
      </div>

      {/* Primary Header */}
      <div className="amazon-header-bg text-white h-[80px] flex items-center px-6 gap-6 md:gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">Z-MART</span>
          <div className="h-2 w-2 bg-primary rounded-full mt-4 ml-1 animate-pulse" />
        </Link>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className={`hidden md:flex flex-1 items-center h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 focus-within:bg-white transition-all focus-within:border-primary focus-within:shadow-2xl focus-within:shadow-primary/20`}
        >
          <div className="h-full border-r border-white/10">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-full border-none bg-transparent focus:ring-0 text-[10px] text-white group-focus-within:text-slate-900 px-5 gap-2 rounded-none shadow-none font-black uppercase tracking-widest">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                {SEARCH_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-[10px] py-3 cursor-pointer font-black uppercase tracking-widest rounded-xl">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input 
            placeholder="Search our premium catalog..." 
            className="flex-1 border-none focus-visible:ring-0 text-white focus-within:text-slate-900 placeholder:text-slate-500 h-full rounded-none px-6 font-bold text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="h-full bg-primary hover:bg-primary/90 px-8 transition-all shrink-0 active:scale-95">
            <Search className="h-5 w-5 text-slate-900" />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="group relative">
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-2xl transition-all">
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {user ? 'Welcome Back' : 'Member Access'}
                </span>
                <span className="text-sm font-black truncate max-w-[100px]">
                  {user?.displayName?.split(' ')[0] || 'Sign In'}
                </span>
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white text-slate-900 shadow-2xl rounded-3xl p-6 hidden group-hover:block border border-slate-100 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
              {user ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                    <p className="text-sm font-black truncate">{user.email}</p>
                  </div>
                  <Separator />
                  <ul className="space-y-2">
                    <li><Link href="/account" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest transition-all"><User className="h-4 w-4" /> Your Profile</Link></li>
                    <li><Link href="/account#orders" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest transition-all"><ShoppingCart className="h-4 w-4" /> Your Orders</Link></li>
                  </ul>
                  <Separator />
                  <Button onClick={handleSignOut} variant="destructive" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <p className="text-sm font-bold text-slate-600">Join our community of elite shoppers.</p>
                  <Button asChild className="amazon-btn-primary w-full h-14 rounded-2xl">
                    <Link href="/login">Sign In Securely</Link>
                  </Button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    New? <Link href="/signup" className="text-primary hover:underline">Start Here</Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link href="/cart" className="relative h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-primary hover:text-slate-900 transition-all group">
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="amazon-subnav-bg text-white h-[50px] flex items-center px-6 gap-8 overflow-x-auto no-scrollbar text-[11px] font-black uppercase tracking-widest">
        <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2">
          <Home className="h-4 w-4" /> Store
        </Link>
        <Link href="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics</Link>
        <Link href="/products?category=Fashion" className="hover:text-primary transition-colors">Fashion</Link>
        <Link href="/products?category=Beauty" className="hover:text-primary transition-colors">Beauty</Link>
        <Link href="/products" className="hover:text-primary transition-colors text-primary">New Releases</Link>
      </div>
    </header>
  );
}