
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShieldCheck, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Accessing Account...</p>
      </div>
    );
  }

  if (!user) return null;

  const accountCards = [
    { title: "Your Orders", desc: "Track, return, or buy things again", icon: Package, href: "/account" },
    { title: "Login & Security", desc: "Edit login, name, and mobile number", icon: ShieldCheck, href: "/account" },
    { title: "Your Addresses", desc: "Edit addresses for orders and gifts", icon: MapPin, href: "/account" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 md:p-10 space-y-10 mb-24">
        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Account</h1>
          <p className="text-slate-500 font-medium">Manage your profile and preferences.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountCards.map((card, idx) => (
            <Link key={idx} href={card.href}>
              <Card className="hover:shadow-md transition-all border-slate-200 cursor-pointer group h-full">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">{card.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
