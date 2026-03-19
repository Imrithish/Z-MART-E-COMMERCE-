
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, Search, Filter, Loader2, MoreVertical, ExternalLink, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { ProductDetailsModal } from "@/components/storefront/ProductDetailsModal";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminOrders() {
  const db = useFirestore();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, loading } = useCollection(ordersQuery);

  const handleDeleteOrder = (orderId: string) => {
    if (!db) return;
    
    deleteDoc(doc(db, 'orders', orderId))
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `orders/${orderId}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-10 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase text-slate-900">Orders</h1>
            <p className="text-slate-500 text-sm md:text-lg font-medium">Monitor customer transactions and fulfillment status.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 font-black uppercase tracking-widest text-[10px] rounded-xl">Export CSV</Button>
            <Button className="w-full sm:w-auto h-11 px-6 rounded-xl shadow-lg bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-[10px] text-white">Process All</Button>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-4 bg-white border-b border-slate-50">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search orders..." className="pl-11 bg-slate-50 border-none h-12 rounded-xl font-bold" />
            </div>
            <Button variant="outline" className="w-full md:w-auto gap-2 h-12 rounded-xl px-6 font-black uppercase tracking-widest text-[10px]">
              <Filter className="h-4 w-4" /> Filter Status
            </Button>
          </CardHeader>
          <CardContent className="p-0 bg-white">
             {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Fetching transactions...</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="min-w-[950px]">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="px-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">Ordered Item</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Date</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</TableHead>
                      <TableHead className="text-right px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 py-6">
                          {order.items && order.items.length > 0 && (
                            <div 
                              className="flex items-center gap-4 cursor-pointer group"
                              onClick={() => {
                                const displayProduct = {
                                  id: order.items[0].productId,
                                  description: "Administrative view of customer purchase.",
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
                              <div className="relative h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                                <Image 
                                  src={order.items[0].imageUrl || 'https://placehold.co/100x100?text=No+Image'} 
                                  alt={order.items[0].name} 
                                  fill 
                                  className="object-contain p-1 group-hover:scale-110 transition-transform duration-500" 
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                                  {order.items[0].name}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  {order.items.length} Units <ExternalLink className="h-2 w-2" />
                                </span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-black text-slate-900">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{order.customerEmail}</div>
                        </TableCell>
                        <TableCell className="text-sm font-bold text-slate-600">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`rounded-xl font-black px-4 py-1 text-[9px] uppercase tracking-widest border-none ${
                              order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 
                              order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-black text-lg text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100 transition-colors">
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-2xl bg-white">
                              <DropdownMenuItem 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer font-black uppercase tracking-widest text-[10px]"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-32 bg-slate-50/50">
                <div className="bg-white h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                   <ShoppingBag className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">No Active Orders</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Transactions will appear here once customers start purchasing.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showActions={false}
      />
    </div>
  );
}
