"use client"

import { LayoutDashboard, Box, ShoppingCart, Settings, LogOut, ChevronLeft, ChevronRight, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Products', icon: Box, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
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
      "h-screen sticky top-0 bg-slate-900 text-white transition-all duration-300 flex flex-col z-40 shadow-2xl",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className="p-8 flex items-center justify-between">
        {!isCollapsed && <span className="text-3xl font-black tracking-tighter text-primary">Z-MART</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/10 text-white rounded-xl"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group",
                isActive 
                  ? "bg-primary text-slate-900 shadow-lg shadow-primary/20" 
                  : "hover:bg-white/5 text-slate-300 hover:text-white"
              )}
            >
              <item.icon className={cn("h-6 w-6 shrink-0 transition-transform group-hover:scale-110", isActive && "scale-110")} />
              {!isCollapsed && <span className="font-black uppercase tracking-widest text-[11px]">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-3">
        <Link 
          href="/"
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all text-slate-300 hover:text-white group",
          )}
        >
          <Store className="h-6 w-6 shrink-0 group-hover:scale-110" />
          {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Storefront</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/10 transition-all text-red-400 group",
          )}
        >
          <LogOut className="h-6 w-6 shrink-0 group-hover:scale-110" />
          {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest text-left">Logout</span>}
        </button>
      </div>
    </aside>
  );
}