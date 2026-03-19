
"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { UserSidebar } from "@/components/storefront/UserSidebar";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShieldCheck, 
  MapPin, 
  Loader2, 
  ArrowRight, 
  ShoppingBag, 
  Clock, 
  ChevronRight,
  ExternalLink,
  CreditCard,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { collection, query, where } from "firebase/firestore";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ReceiptModal } from "@/components/storefront/ReceiptModal";

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
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'security' | 'addresses'>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Handle Hash navigation from sidebar
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['orders', 'security', 'addresses'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch User Orders
  const ordersQuery = useMemo(() => {
    if (!db || !user?.email) return null;
    return query(
      collection(db, 'orders'),
      where('customerEmail', '==', user.email)
    );
  }, [db, user?.email]);

  const { data: rawOrders, loading: ordersLoading } = useCollection(ordersQuery);

  // Client-side sorting of orders by creation date
  const orders = useMemo(() => {
    if (!rawOrders) return null;
    return [...rawOrders].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [rawOrders]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleViewReceipt = (order: any) => {
    setSelectedReceipt(order);
    setIsReceiptOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-black text-slate-500 uppercase tracking-widest text-xs text-center">
          Syncing Account...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const lastOrder = orders?.[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-body">
      <UserSidebar />
      
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Navbar />

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 md:p-10 lg:p-14 space-y-8 md:space-y-12 mb-24">
          <header className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-3 md:gap-4">
               <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                {activeTab === 'overview' ? 'Dashboard' : activeTab === 'orders' ? 'My Orders' : 'Account Settings'}
               </h1>
               <div className="h-2 w-2 bg-primary rounded-full mt-2 md:mt-4" />
            </div>
            <p className="text-slate-500 font-medium text-sm md:text-lg">
              {activeTab === 'overview' 
                ? `Welcome back, ${user.displayName || user.email}`
                : `Manage your ${activeTab} and preferences.`
              }
            </p>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Stats & Last Order Summary */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <Card className="lg:col-span-2 bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Latest Activity</CardTitle>
                    <Link href="#orders" onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                      View All <ChevronRight className="h-3 w-3" />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-8">
                    {ordersLoading ? (
                      <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : lastOrder ? (
                      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                        <div className="relative h-32 w-32 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 p-4 shrink-0 shadow-inner">
                          <Image 
                            src={lastOrder.items?.[0]?.imageUrl || 'https://placehold.co/200x200'} 
                            alt="Last Order" 
                            fill 
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 mb-2">
                              {lastOrder.status}
                            </Badge>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{lastOrder.items?.[0]?.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Ordered on {lastOrder.createdAt?.toDate ? format(lastOrder.createdAt.toDate(), 'MMMM dd, yyyy') : 'Recently'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 justify-center sm:justify-start">
                             <div className="text-lg font-black text-slate-900">{formatCurrency(lastOrder.totalAmount)}</div>
                             <div className="h-4 w-px bg-slate-200" />
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lastOrder.items?.length} Items</div>
                          </div>
                          <Button onClick={() => handleViewReceipt(lastOrder)} variant="ghost" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[9px] text-primary hover:bg-primary/5">
                            View Details <ExternalLink className="h-3.5 w-3.5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-4">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingBag className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No orders yet</p>
                        <Button asChild variant="outline" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-6">
                    <UserIcon className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Member Status</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">You have been a Z-MART member since {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'yyyy') : '2024'}.</p>
                    </div>
                  </div>
                  <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Spent</p>
                      <p className="text-xl font-black">{formatCurrency(orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0)}</p>
                    </div>
                    <Badge className="bg-white text-slate-900 border-none font-black text-[9px] px-3 py-1">ELITE</Badge>
                  </div>
                </Card>
              </section>

              {/* Navigation Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[
                  { title: "My Orders", desc: "Track and manage your purchases", icon: Package, tab: 'orders' },
                  { title: "Privacy", desc: "Update security and passwords", icon: ShieldCheck, tab: 'security' },
                  { title: "Addresses", desc: "Manage delivery locations", icon: MapPin, tab: 'addresses' },
                ].map((card, idx) => (
                  <button key={idx} onClick={() => setActiveTab(card.tab as any)}>
                    <Card className="hover:shadow-2xl transition-all duration-500 border-none rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer group h-full bg-white shadow-sm overflow-hidden border-slate-100 text-left w-full">
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
                  </button>
                ))}
              </section>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{orders?.length || 0} Total Orders</p>
                  <Button variant="ghost" onClick={() => setActiveTab('overview')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary">
                    Back to Overview
                  </Button>
               </div>

               {ordersLoading ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Order History...</p>
                 </div>
               ) : orders && orders.length > 0 ? (
                 <div className="grid grid-cols-1 gap-6">
                   {orders.map((order: any) => (
                     <Card key={order.id} className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                          <div className="flex -space-x-6 shrink-0">
                            {order.items?.slice(0, 3).map((item: any, i: number) => (
                              <div key={i} className="relative h-24 w-24 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2 group-hover:scale-105 transition-transform duration-500" style={{ zIndex: 10 - i }}>
                                <Image src={item.imageUrl || 'https://placehold.co/100x100'} alt={item.name} fill className="object-contain p-1" />
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="h-24 w-24 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs border-2 border-white shadow-xl relative z-0">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <Clock className="h-3 w-3" /> {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                                </p>
                              </div>
                              <Badge className={`rounded-full font-black px-4 py-1 text-[8px] uppercase tracking-widest border-none ${
                                order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 
                                order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                                order.status === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {order.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-4 border-t border-slate-50">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</p>
                                  <p className="text-sm font-black text-slate-900">{formatCurrency(order.totalAmount)}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ship To</p>
                                  <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</p>
                                  <p className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-1.5">
                                    <CreditCard className="h-3 w-3 text-slate-400" /> {order.paymentMethod}
                                  </p>
                               </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex md:flex-col gap-3 w-full md:w-auto">
                            <Button className="flex-1 md:flex-none h-12 px-8 rounded-xl bg-slate-900 hover:bg-primary text-white hover:text-slate-900 font-black uppercase tracking-widest text-[9px] transition-all">
                              Track Pack
                            </Button>
                            <Button onClick={() => handleViewReceipt(order)} variant="outline" className="flex-1 md:flex-none h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[9px] border-slate-100">
                              View Receipt
                            </Button>
                          </div>
                        </div>
                     </Card>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 flex flex-col items-center text-center">
                    <div className="bg-white h-32 w-32 rounded-[3rem] flex items-center justify-center mb-8 shadow-xl">
                      <ShoppingBag className="h-12 w-12 text-slate-200" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">No Transactions Found</h2>
                    <p className="text-slate-500 max-w-xs mb-8 font-medium">Your order history is currently empty. Start exploring our premium collection.</p>
                    <Button asChild className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-xs text-white">
                      <Link href="/products">Browse Trending</Link>
                    </Button>
                 </div>
               )}
            </div>
          )}

          {(activeTab === 'security' || activeTab === 'addresses') && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card className="bg-white border-none shadow-sm rounded-[3rem] p-12 text-center max-w-2xl mx-auto">
                 <div className="bg-slate-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    {activeTab === 'security' ? <ShieldCheck className="h-10 w-10 text-slate-200" /> : <MapPin className="h-10 w-10 text-slate-200" />}
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{activeTab} Terminal</h2>
                 <p className="text-slate-500 font-medium mb-10">This section is currently being encrypted for your security. Please check back shortly.</p>
                 <Button onClick={() => setActiveTab('overview')} variant="outline" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px]">
                   Return to Dashboard
                 </Button>
              </Card>
            </div>
          )}

          {activeTab === 'overview' && (
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
          )}
        </main>

        <Footer />
        
        <ReceiptModal 
          isOpen={isReceiptOpen} 
          order={selectedReceipt} 
          onClose={() => setIsReceiptOpen(false)} 
        />
      </div>
    </div>
  );
}
