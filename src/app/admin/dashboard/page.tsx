
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, TrendingUp, Users, ArrowUpRight, Box, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

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

  // Real Stats Calculation
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
    { label: 'Recent Revenue', value: formatCurrency(totalRevenue), icon: IndianRupee, change: '+12.5%', color: 'text-green-700', bg: 'bg-green-100' },
    { label: 'Active Orders', value: activeOrdersCount.toString(), icon: ShoppingCart, change: '+5', color: 'text-blue-700', bg: 'bg-blue-100' },
    { label: 'Total Customers', value: '1,240', icon: Users, change: '+18%', color: 'text-purple-700', bg: 'bg-purple-100' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '+0.4%', color: 'text-orange-700', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-14 space-y-12 overflow-hidden">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Merchant Dashboard</h1>
          <p className="text-slate-600 text-lg font-medium">Monitoring your marketplace performance and supply chain.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest">{stat.label}</CardTitle>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className={`text-xs flex items-center gap-1 font-black ${stat.color}`}>
                  {stat.change} <ArrowUpRight className="h-3 w-3" />
                  <span className="text-slate-500 font-bold ml-1 uppercase tracking-widest">vs Last Month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Recent Transactions</CardTitle>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px] text-slate-700 border-slate-300">Live Updates</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-100/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="px-8 h-14 font-black text-slate-600 uppercase text-[10px] tracking-widest">ID</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest">Customer</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest">Status</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest text-right px-8">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order: any) => (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors border-slate-100">
                        <TableCell className="px-8 font-mono text-[11px] font-bold text-slate-600 uppercase">{order.id.slice(0, 8)}</TableCell>
                        <TableCell className="py-5">
                          <div className="font-black text-slate-900">{order.customerName}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{order.customerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`rounded-xl font-black px-4 py-1 text-[9px] uppercase tracking-widest ${
                              order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-800'
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
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions yet</div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Supply Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                {[
                  { title: "Low Stock: Smart Home Hub", desc: "Only 5 items remaining.", status: "Warning", color: "bg-orange-100 text-orange-700", border: "border-orange-200" },
                  { title: "Out of Stock: Office Chair", desc: "Listing hidden from store.", status: "Urgent", color: "bg-red-100 text-red-700", border: "border-red-200" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5 group">
                    <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
                      <Box className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-slate-900 leading-tight mb-1 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-600 font-bold uppercase tracking-widest mb-3">{item.desc}</div>
                      <Badge variant="outline" className={`${item.color} ${item.border} rounded-lg text-[9px] font-black uppercase`}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
