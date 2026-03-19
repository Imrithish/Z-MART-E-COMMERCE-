"use client"

import { LayoutDashboard, Box, ShoppingCart, Settings, LogOut, ChevronLeft, ChevronRight, Store, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Catalog', icon: Box, href: '/admin/products' },
  { label: 'Fulfillment', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Preferences', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-slate-900 text-white transition-all duration-500 flex flex-col z-40 shadow-2xl border-r border-white/5",
      isCollapsed ? "w-24" : "w-80"
    )}>
      <div className="p-8 flex items-center justify-between border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">Z-MART</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Merchant Hub</span>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/10 text-slate-400 rounded-xl transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-3 mt-10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20 scale-105" 
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <item.icon className={cn("h-6 w-6 shrink-0 transition-transform duration-500 group-hover:scale-110", isActive && "scale-110")} />
              {!isCollapsed && <span className="font-black uppercase tracking-widest text-[11px] leading-none">{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-900/10" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-4 border-t border-white/5">
        <Link 
          href="/"
          className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-slate-400 hover:text-white group",
          )}
        >
          <Store className="h-6 w-6 shrink-0 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Go To Store</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/10 transition-all text-red-500/60 hover:text-red-500 group",
          )}
        >
          <LogOut className="h-6 w-6 shrink-0 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest text-left">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}