
"use client"

import Link from "next/link";
import { 
  ShoppingCart, 
  User, 
  Search, 
  Home, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  MapPin, 
  Laptop, 
  Shirt, 
  Utensils, 
  Sparkles, 
  ArrowRight,
  Menu,
  Package,
  Shield,
  UserCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORY_GROUPS = [
  {
    label: "Digital & Tech",
    icon: Laptop,
    items: [
      { name: "Laptops", desc: "Performance machines" },
      { name: "Mobiles", desc: "Next-gen smartphones" },
      { name: "Audio", desc: "Audiophile grade" },
      { name: "Gaming", desc: "Pro gear & consoles" }
    ]
  },
  {
    label: "Style & Trend",
    icon: Shirt,
    items: [
      { name: "Men's Clothing", desc: "Modern classics" },
      { name: "Women's Clothing", desc: "Designer labels" },
      { name: "Accessories", desc: "The final touch" },
      { name: "Watches", desc: "Precision time" }
    ]
  },
  {
    label: "Home & Life",
    icon: Utensils,
    items: [
      { name: "Appliances", desc: "Smart home tech" },
      { name: "Furniture", desc: "Luxury comfort" },
      { name: "Decor", desc: "Aesthetic living" },
      { name: "Garden", desc: "Outdoor oasis" }
    ]
  },
  {
    label: "Beauty & Wellness",
    icon: Sparkles,
    items: [
      { name: "Skincare", desc: "Premium care" },
      { name: "Makeup", desc: "Artistic beauty" },
      { name: "Haircare", desc: "Salon quality" },
      { name: "Personal Care", desc: "Daily essentials" }
    ]
  }
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("q", searchQuery.trim());
    if (selectedCategory !== "All") params.append("category", selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  const selectCategoryFromMenu = (category: string) => {
    setSelectedCategory(category);
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/products?category=${category}`);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-xl">
      {/* Primary Header */}
      <div className="amazon-header-bg text-white h-[65px] flex items-center px-4 md:px-6 gap-3 md:gap-8 justify-between">
        
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none bg-slate-900 text-white w-[300px]">
              <SheetHeader className="p-6 border-b border-white/5 bg-slate-950">
                <SheetTitle className="text-white flex items-center gap-2">
                  <span className="text-xl font-black uppercase tracking-tighter">Z-MART</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Browse</span>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-6 space-y-8">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.label} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <group.icon className="h-4 w-4 text-primary" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</h4>
                      </div>
                      <ul className="space-y-3 pl-7">
                        {group.items.map((item) => (
                          <li key={item.name}>
                            <button 
                              onClick={() => selectCategoryFromMenu(item.name)}
                              className="text-sm font-bold text-white/80 hover:text-primary transition-colors uppercase tracking-tight"
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                  <Separator className="bg-white/5" />
                  
                  {user && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Account</h4>
                      <ul className="space-y-3 pl-7">
                        <li><Link href="/account" className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}><Package className="h-4 w-4" /> Your Orders</Link></li>
                        <li><Link href="/account" className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}><Shield className="h-4 w-4" /> Login & Security</Link></li>
                        <li><Link href="/account" className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}><MapPin className="h-4 w-4" /> Your Addresses</Link></li>
                        <li>
                          <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-tight"><LogOut className="h-4 w-4" /> Sign Out</button>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {!user && (
                    <div className="space-y-4">
                      <Button asChild className="w-full bg-primary text-slate-900 font-black uppercase text-xs tracking-widest">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <span className="text-xl md:text-3xl font-black tracking-tighter group-hover:text-primary transition-colors uppercase">Z-MART</span>
            <div className="h-1.5 w-1.5 bg-primary rounded-full mt-3 ml-0.5" />
          </Link>
        </div>

        {/* Categories Mega Menu Selector (Desktop) */}
        <div className="hidden md:block">
          <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
            <PopoverTrigger asChild>
              <button className="h-10 bg-white/5 hover:bg-white/10 text-white px-6 gap-2 flex items-center text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">
                <Menu className="h-4 w-4 mr-2" />
                <span>Categories</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isMegaMenuOpen && "rotate-180")} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[800px] p-0 border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden" align="center" sideOffset={10}>
              <div className="grid grid-cols-4 p-8 bg-white gap-8">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <group.icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.label}</h4>
                    </div>
                    <ul className="space-y-4">
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <button 
                            onClick={() => selectCategoryFromMenu(item.name)}
                            className="group flex flex-col items-start text-left hover:text-primary transition-colors w-full"
                          >
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight mb-0.5 group-hover:text-primary">{item.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.desc}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Global Search (Header) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-4 items-center h-10 rounded-xl overflow-hidden bg-white/10 group focus-within:bg-white transition-all border border-white/10 focus-within:border-primary">
          <form onSubmit={handleSearch} className="flex-1 flex items-center h-full">
            <Input 
              placeholder="Quick search..." 
              className="flex-1 border-none focus-visible:ring-0 text-white group-focus-within:text-slate-900 placeholder:text-white/50 group-focus-within:placeholder:text-slate-400 h-full bg-transparent px-4 font-bold text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="h-full px-4 hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="group relative">
            <button className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-xl transition-all text-left">
              <UserCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {user ? `Hi, ${user.displayName?.split(' ')[0]}` : 'Account'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black uppercase tracking-tight">Profile</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </button>
            
            <div className="absolute top-[calc(100%+0px)] right-0 w-72 bg-white text-slate-900 shadow-2xl rounded-3xl p-6 hidden group-hover:block border border-slate-100 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
              {user ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</p>
                    <p className="text-sm font-black truncate text-slate-900">{user.email}</p>
                  </div>
                  <Separator className="bg-slate-100" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Account</p>
                    <ul className="space-y-1">
                      <li>
                        <Link href="/account" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest transition-all">
                          <Package className="h-4 w-4 text-slate-400" /> Your Orders
                        </Link>
                      </li>
                      <li>
                        <Link href="/account" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest transition-all">
                          <Shield className="h-4 w-4 text-slate-400" /> Login & Security
                        </Link>
                      </li>
                      <li>
                        <Link href="/account" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest transition-all">
                          <MapPin className="h-4 w-4 text-slate-400" /> Your Addresses
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Separator className="bg-slate-100" />
                  <Button onClick={handleSignOut} variant="ghost" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <Button asChild className="amazon-btn-primary w-full h-12 rounded-xl">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Register? <Link href="/signup" className="text-primary hover:underline">Create Account</Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link href="/cart" className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-xl transition-all group relative">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-slate-900 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-slate-900">
                {totalItems}
              </span>
            </div>
            <span className="hidden md:block text-xs font-black uppercase tracking-tight mt-auto pb-0.5">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="amazon-subnav-bg text-white h-[45px] flex items-center px-4 md:px-6 gap-3 md:gap-6 overflow-x-auto no-scrollbar text-[10px] md:text-[11px] font-black uppercase tracking-widest border-t border-white/5">
        <Link href="/" className="hover:bg-white/10 py-1.5 px-4 rounded-lg transition-all flex items-center gap-2 shrink-0">
          <Home className="h-3 w-3" /> Home
        </Link>
        <Link href="/products?category=Electronics" className="hover:bg-white/10 py-1.5 px-4 rounded-lg transition-all shrink-0">Electronics</Link>
        <Link href="/products?category=Fashion" className="hover:bg-white/10 py-1.5 px-4 rounded-lg transition-all shrink-0">Fashion</Link>
        <Link href="/products?category=Home & Kitchen" className="hover:bg-white/10 py-1.5 px-4 rounded-lg transition-all shrink-0">Home Decor</Link>
        <Link href="/products" className="hover:bg-white/10 py-1.5 px-4 rounded-lg transition-all text-primary shrink-0">Today's Deals</Link>
      </div>
    </header>
  );
}
