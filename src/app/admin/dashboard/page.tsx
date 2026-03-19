
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, TrendingUp, Users, ArrowUpRight, Box, Loader2, IndianRupee } from "lucide-react";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const { data: recentOrders, loading: ordersLoading } = useCollection(ordersQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const totalRevenue = useMemo(() => {
    return recentOrders?.reduce((sum, order: any) => sum + (order.totalAmount || 0), 0) || 0;
  }, [recentOrders]);

  const activeOrdersCount = useMemo(() => {
    return recentOrders?.filter((order: any) => order.status !== 'Delivered').length || 0;
  }, [recentOrders]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-black text-slate-600 uppercase tracking-widest text-xs">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: IndianRupee, change: '+12.5%', color: 'text-green-700', bg: 'bg-green-100' },
    { label: 'Active Orders', value: activeOrdersCount.toString(), icon: ShoppingCart, change: '+5', color: 'text-blue-700', bg: 'bg-blue-100' },
    { label: 'Total Customers', value: '1,240', icon: Users, change: '+18%', color: 'text-purple-700', bg: 'bg-purple-100' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '+0.4%', color: 'text-orange-700', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Monitoring your store performance.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden group bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className={`text-[9px] flex items-center gap-1 font-black ${stat.color} uppercase tracking-widest`}>
                  {stat.change} <ArrowUpRight className="h-3 w-3" />
                  <span className="text-slate-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 md:p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-widest">Recent Transactions</CardTitle>
                <Badge className="rounded-full px-4 py-1 font-black uppercase text-[8px] bg-slate-900 text-white border-none tracking-widest">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="px-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">Items</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-right px-8">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order: any) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50/50 transition-colors border-slate-50">
                          <TableCell className="px-8 py-4">
                            {order.items && order.items.length > 0 && (
                              <div 
                                className="flex items-center gap-4 cursor-pointer group"
                                onClick={() => {
                                  const displayProduct = {
                                    id: order.items[0].productId,
                                    description: "Transaction preview item.",
                                    rating: 5,
                                    reviews: 0,
                                    category: "Order Item",
                                    features: [],
                                    ...order.items[0]
                                  };
                                  setSelectedProduct(displayProduct);
                                  setIsModalOpen(true);
                                }}
                              >
                                <div className="relative h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                                  <Image 
                                    src={order.items[0].imageUrl || 'https://placehold.co/100x100?text=No+Image'} 
                                    alt={order.items[0].name} 
                                    fill 
                                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-500" 
                                  />
                                </div>
                                <span className="text-[11px] font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                                  {order.items[0].name}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-black text-slate-900 text-sm">{order.customerName}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase">{order.customerEmail}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              className={`rounded-full font-black px-3 py-1 text-[8px] uppercase tracking-widest border-none ${
                                order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 
                                order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                                'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8 font-black text-slate-900 text-base">
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">No active transactions</div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-widest">Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                {[
                  { title: "Smart Hub Pro", desc: "Low Stock: 5 Units", status: "Critical", color: "bg-red-50 text-red-600" },
                  { title: "Ergo Chair Ultra", desc: "Out of Stock", status: "Restock Now", color: "bg-slate-100 text-slate-900" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      <Box className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{item.title}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.desc}</div>
                      <Badge className={`rounded-md text-[7px] font-black uppercase tracking-tighter ${item.color} border-none`}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
