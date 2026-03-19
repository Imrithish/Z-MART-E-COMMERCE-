
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, User as UserIcon, Package, ShieldCheck, MapPin, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const userOrdersQuery = useMemo(() => {
    if (!db || !user?.email) return null;
    // Query orders specifically for this customer
    return query(
      collection(db, 'orders'),
      where('customerEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.email]);

  const { data: orders, loading: ordersLoading } = useCollection(userOrdersQuery);

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
    { title: "Your Orders", desc: "Track, return, or buy things again", icon: Package, href: "/account#orders" },
    { title: "Login & Security", desc: "Edit login, name, and mobile number", icon: ShieldCheck, href: "/account" },
    { title: "Your Addresses", desc: "Edit addresses for orders and gifts", icon: MapPin, href: "/account" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 md:p-10 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Account</h1>
          <p className="text-slate-500 font-medium">Manage your profile, orders, and preferences.</p>
        </header>

        {/* Quick Links Grid */}
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

        {/* Orders Section */}
        <section id="orders" className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Recent Orders</h2>
            <Link href="/products" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-20 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                </div>
              ) : orders && orders.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="px-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Date</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                      <TableHead className="text-right px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-mono text-[11px] font-bold text-slate-600 uppercase">
                          {order.id.slice(0, 12)}
                        </TableCell>
                        <TableCell className="font-bold text-slate-700 text-sm">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMMM dd, yyyy') : 'Recently'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`rounded-xl font-black px-4 py-1 text-[9px] uppercase tracking-widest ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                              'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8 font-black text-slate-900 text-lg">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-20 text-center flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">No orders yet</h3>
                    <p className="text-sm text-slate-500 font-medium">You haven't placed any orders with us. Start exploring our deals!</p>
                  </div>
                  <Button asChild className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-[10px] text-white">
                    <Link href="/products">Browse Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-auto bg-white border-t border-slate-200 py-10 text-center">
        <div className="flex justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          <Link href="#" className="hover:text-primary transition-colors">Conditions of Use</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Notice</Link>
          <Link href="#" className="hover:text-primary transition-colors">Help</Link>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2024 Z-MART.in • Your Premium Marketplace</p>
      </footer>
    </div>
  );
}
