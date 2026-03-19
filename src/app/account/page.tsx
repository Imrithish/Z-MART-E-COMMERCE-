
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { UserSidebar } from "@/components/storefront/UserSidebar";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShieldCheck, MapPin, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-black text-slate-500 uppercase tracking-widest text-xs">Syncing Account...</p>
      </div>
    );
  }

  if (!user) return null;

  const accountCards = [
    { title: "Manage Orders", desc: "View transaction history and tracking", icon: Package, href: "/account#orders" },
    { title: "Privacy & Security", desc: "Update your credentials and encryption", icon: ShieldCheck, href: "/account#security" },
    { title: "Delivery Addresses", desc: "Manage saved locations for shipping", icon: MapPin, href: "/account#addresses" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-body">
      <UserSidebar />
      
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar />

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 md:p-10 lg:p-14 space-y-8 md:space-y-12 mb-24">
          <header className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-3 md:gap-4">
               <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Your Profile</h1>
               <div className="h-2 w-2 bg-primary rounded-full mt-2 md:mt-4" />
            </div>
            <p className="text-slate-500 font-medium text-sm md:text-lg">Signed in as <span className="text-slate-900 font-black">{user.displayName || user.email}</span></p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {accountCards.map((card, idx) => (
              <Link key={idx} href={card.href}>
                <Card className="hover:shadow-2xl transition-all duration-500 border-none rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer group h-full bg-white shadow-sm overflow-hidden border-slate-100">
                  <CardContent className="p-6 md:p-8 flex flex-col gap-4 md:gap-6">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-inner">
                      <card.icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight text-base md:text-lg leading-none">{card.title}</h3>
                      <p className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="mt-auto pt-2 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                      Configure <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>

          <section className="pt-10 md:pt-20 border-t border-slate-100">
            <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative z-10 space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Z-MART Exclusive</h2>
                <p className="text-slate-400 max-w-lg font-medium text-sm md:text-base">As a registered member, you have access to priority support and early releases. Manage your membership preferences here.</p>
                <Button className="h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-primary text-slate-900 font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white transition-colors border-none">
                  Upgrade Membership
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

