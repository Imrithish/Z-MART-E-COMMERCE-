"use client"

import { LayoutDashboard, Box, ShoppingCart, Settings, LogOut, ChevronLeft, ChevronRight, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Products', icon: Box, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-primary text-primary-foreground border-r transition-all duration-300 flex flex-col",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <span className="text-2xl font-bold tracking-tighter">Z-MART</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/10"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              pathname.startsWith(item.href) 
                ? "bg-white text-primary shadow-lg" 
                : "hover:bg-white/10"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-2">
        <Link 
          href="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-white/70",
          )}
        >
          <Store className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Storefront</span>}
        </Link>
        <Link 
          href="/admin/login"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-red-300",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}