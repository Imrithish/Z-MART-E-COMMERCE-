
"use client"

import { Package, ShieldCheck, MapPin, LogOut, ChevronLeft, ChevronRight, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_ITEMS = [
  { label: 'Orders', icon: Package, href: '/account#orders' },
  { label: 'Security', icon: ShieldCheck, href: '/account#security' },
  { label: 'Addresses', icon: MapPin, href: '/account#addresses' },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-slate-900 text-white transition-all duration-500 flex flex-col z-40 shadow-2xl border-r border-white/5 shrink-0",
      isCollapsed ? "w-20 md:w-24" : "w-64 md:w-80"
    )}>
      <div className="p-4 md:p-8 flex items-center justify-between border-b border-white/5 min-h-[80px]">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <User className="h-6 w-6 md:h-8 md:w-8 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tighter leading-none uppercase">Account</span>
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Member</span>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/10 text-slate-400 rounded-xl transition-all h-8 w-8 md:h-10 md:w-10"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-2 md:px-4 space-y-2 md:space-y-3 mt-6 md:mt-10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname === '/account' && item.label === 'Orders');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-slate-900 shadow-xl shadow-primary/20 scale-105" 
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 md:h-6 md:w-6 shrink-0 transition-transform duration-500 group-hover:scale-110", isActive && "scale-110")} />
              {!isCollapsed && <span className="font-black uppercase tracking-widest text-[10px] md:text-[11px] leading-none truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 md:p-6 space-y-2 md:space-y-4 border-t border-white/5">
        <Link 
          href="/"
          className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-white/5 transition-all text-slate-400 hover:text-white group"
        >
          <Store className="h-5 w-5 md:h-6 md:w-6 shrink-0 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Store</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-red-500/10 transition-all text-red-500/60 hover:text-red-500 group"
        >
          <LogOut className="h-5 w-5 md:h-6 md:w-6 shrink-0 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-left">Out</span>}
        </button>
      </div>
    </aside>
  );
}

