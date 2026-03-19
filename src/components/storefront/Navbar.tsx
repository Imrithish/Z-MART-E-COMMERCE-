"use client"

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, MapPin, ChevronDown, Globe, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  {
    title: "Trending",
    items: ["Best Sellers", "New Releases", "Movers and Shakers"]
  },
  {
    title: "Shop by Category",
    items: ["Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care", "Books", "Sports & Outdoors"]
  },
  {
    title: "Programs & Features",
    items: ["Today's Deals", "Gift Cards", "Z-Mart Live", "International Shopping"]
  },
  {
    title: "Help & Settings",
    items: ["Your Account", "Customer Service", "Sign Out"]
  }
];

const SEARCH_CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Books",
  "Sports",
  "Devices"
];

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { totalItems } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = "/products?";
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append("q", searchQuery.trim());
    }
    
    if (selectedCategory !== "All Categories") {
      params.append("category", selectedCategory);
    }

    if (params.toString()) {
      router.push(`/products?${params.toString()}`);
    }
  };

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
        <form 
          onSubmit={handleSearch}
          className={`flex-1 flex items-center h-10 rounded-md overflow-hidden bg-white ${isSearchFocused ? 'ring-2 ring-[#ff9900]' : ''}`}
        >
          <div className="h-full bg-gray-100 hover:bg-gray-200 border-r transition-colors">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-full border-none bg-transparent focus:ring-0 text-[11px] text-gray-700 px-3 gap-1 rounded-none shadow-none w-auto max-w-[120px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-gray-200 shadow-xl">
                {SEARCH_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs py-2 cursor-pointer">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input 
            placeholder="Search Z-Mart" 
            className="flex-1 border-none focus-visible:ring-0 text-black placeholder:text-gray-500 h-full rounded-none px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button type="submit" className="h-full bg-[#febd69] hover:bg-[#f3a847] px-4 transition-colors shrink-0">
            <Search className="h-6 w-6 text-[#131921]" />
          </button>
        </form>

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
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm shrink-0">
              <Menu className="h-5 w-5" /> All
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[365px] border-none bg-white">
            <SheetHeader className="amazon-subnav-bg text-white p-4 flex flex-row items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <User className="h-5 w-5 text-[#232f3e]" />
              </div>
              <SheetTitle className="text-white text-lg font-bold">Hello, sign in</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-64px)] py-4">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="px-8 py-2 text-base font-bold text-gray-900">{cat.title}</h3>
                  <ul className="space-y-1">
                    {cat.items.map((item, i) => (
                      <li key={i}>
                        <Link 
                          href={`/products?category=${encodeURIComponent(item)}`}
                          className="flex items-center justify-between px-8 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item}
                          {(cat.title === "Shop by Category" || cat.title === "Trending") && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {idx < CATEGORIES.length - 1 && <Separator className="my-4 mx-0" />}
                </div>
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
        
        <Link href="/products" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Today's Deals</Link>
        <Link href="/products?category=Electronics" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Electronics</Link>
        <Link href="/products?category=Fashion" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Fashion</Link>
        <Link href="/products?category=Home%20%26%20Kitchen" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Home & Kitchen</Link>
        <Link href="/products" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Customer Service</Link>
        <Link href="/products" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Sell</Link>
        <div className="flex-1" />
        <span className="hidden lg:block text-sm font-bold px-2 py-1">Shop great deals now</span>
      </div>
    </header>
  );
}
