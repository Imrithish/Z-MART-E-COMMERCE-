
"use client"

import Link from "next/link";
import { 
  ShoppingCart, 
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
  Menu,
  Package,
  UserCircle,
  Heart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useUser, useAuth, useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const { totalItems } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const wishlistQuery = useMemo(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'wishlist');
  }, [db, user?.uid]);

  const { data: wishlistItems } = useCollection(wishlistQuery);

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
    router.push(`/products?category=${category}`);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="w-full flex flex-col shadow-xl">
      <div className="amazon-header-bg text-white h-[65px] flex items-center px-2 md:px-6 gap-2 md:gap-8 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center group shrink-0">
            <span className="text-lg md:text-3xl font-black tracking-tighter group-hover:text-primary transition-colors uppercase">Z-MART</span>
            <div className="h-1 w-1 bg-primary rounded-full mt-2 md:mt-3 ml-0.5" />
          </Link>
        </div>

        <div className="flex items-center">
          <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
            <PopoverTrigger asChild>
              <button className="h-9 bg-white/5 hover:bg-white/10 text-white px-3 md:px-6 gap-1 md:gap-2 flex items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">
                <Menu className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Categories</span>
                <ChevronDown className={cn("h-2.5 w-2.5 transition-transform", isMegaMenuOpen && "rotate-180")} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] md:w-[800px] p-0 border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden" align="center" sideOffset={10}>
              <div className="grid grid-cols-2 md:grid-cols-4 p-4 md:p-8 bg-white gap-4 md:gap-8 max-h-[70vh] overflow-y-auto">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <group.icon className="h-3 w-3 md:h-4 md:w-4" />
                      </div>
                      <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.label}</h4>
                    </div>
                    <ul className="space-y-2 md:space-y-4">
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <button 
                            onClick={() => selectCategoryFromMenu(item.name)}
                            className="group flex flex-col items-start text-left hover:text-primary transition-colors w-full"
                          >
                            <span className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-tight mb-0.5 group-hover:text-primary">{item.name}</span>
                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter hidden md:inline">{item.desc}</span>
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

        <div className="flex flex-1 max-w-xl mx-2 items-center h-9 rounded-xl overflow-hidden bg-white/10 group focus-within:bg-white transition-all border border-white/10 focus-within:border-primary">
          <form onSubmit={handleSearch} className="flex-1 flex items-center h-full">
            <Input 
              placeholder="Search..." 
              className="flex-1 border-none focus-visible:ring-0 text-white group-focus-within:text-slate-900 placeholder:text-white/50 group-focus-within:placeholder:text-slate-400 h-full bg-transparent px-3 font-bold text-[10px] md:text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="h-full px-3 hover:text-primary transition-colors">
              <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="group relative">
            <button className="flex items-center gap-1 hover:bg-white/10 p-1.5 rounded-xl transition-all">
              <UserCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {user ? `Hi, ${(user.displayName || user.email?.split('@')[0] || 'User').split(' ')[0]}` : 'Account'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black uppercase tracking-tight">Profile</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </button>
            
            <div className="absolute top-[calc(100%+0px)] right-0 w-64 md:w-72 bg-white text-slate-900 shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-6 hidden group-hover:block border border-slate-100 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
              {user ? (
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</p>
                    <p className="text-xs md:text-sm font-black truncate text-slate-900">{user.email}</p>
                  </div>
                  <Separator className="bg-slate-100" />
                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Your Account</p>
                    <ul className="space-y-1">
                      <li>
                        <Link href="/account" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-slate-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all">
                          <Package className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Your Orders
                        </Link>
                      </li>

                      <li>
                        <Link href="/account#wishlist" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-slate-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all">
                          <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> 
                          <span className="flex-1 text-left">Your Wishlist</span>
                          {wishlistItems && wishlistItems.length > 0 && (
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px]">{wishlistItems.length}</span>
                          )}
                        </Link>
                      </li>

                      <li>
                        <Link href="/account#addresses" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-slate-50 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all">
                          <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Your Addresses
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Separator className="bg-slate-100" />
                  <Button onClick={handleSignOut} variant="ghost" className="w-full h-10 md:h-12 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <Button asChild className="amazon-btn-primary w-full h-10 md:h-12 rounded-xl text-[10px] md:text-xs">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                    New to Z-MART? <Link href="/signup" className="text-primary hover:underline">Create Account</Link>
                  </p>
                </div>
              )}
            </div>
          </div>



          <Link href="/cart" className="flex items-center gap-1 hover:bg-white/10 p-1.5 rounded-xl transition-all group relative">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-white" />
              <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-primary text-slate-900 text-[8px] md:text-[10px] font-black flex items-center justify-center rounded-full border-2 border-slate-900">
                {totalItems}
              </span>
            </div>
            <span className="hidden sm:block text-xs font-black uppercase tracking-tight mt-auto pb-0.5">Cart</span>
          </Link>
        </div>
      </div>

      <div className="amazon-subnav-bg text-white h-[45px] flex items-center px-4 md:px-6 gap-3 md:gap-6 overflow-x-auto no-scrollbar text-[9px] md:text-[11px] font-black uppercase tracking-widest border-t border-white/5">
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

