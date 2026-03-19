"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, Search, Filter, Loader2, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminOrders() {
  const db = useFirestore();

  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, loading } = useCollection(ordersQuery);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Orders</h1>
            <p className="text-muted-foreground text-lg">Monitor customer transactions and fulfillment status.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11">Export CSV</Button>
            <Button className="h-11 px-6 rounded-xl shadow-lg">Process All</Button>
          </div>
        </header>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders by ID or customer..." className="pl-9 bg-muted/30 border-none" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter Status
            </Button>
          </CardHeader>
          <CardContent>
             {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Fetching transactions...</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs font-bold text-slate-500 uppercase">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`rounded-xl font-bold px-3 py-1 text-[10px] uppercase ${
                            order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon">
                           <MoreVertical className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed">
                <div className="bg-white h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <ShoppingBag className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-widest">No Active Orders</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">Transactions will appear here once customers start purchasing from your store.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
