import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, TrendingUp, Users, DollarSign, ArrowUpRight, Box } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$12,845.00', icon: DollarSign, change: '+12.5%', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Orders', value: '45', icon: ShoppingCart, change: '+5', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Customers', value: '1,240', icon: Users, change: '+18%', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '+0.4%', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-14 space-y-12 overflow-hidden">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Merchant Dashboard</h1>
          <p className="text-slate-500 text-lg font-medium">Monitoring your marketplace performance and supply chain.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</CardTitle>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className={`text-xs flex items-center gap-1 font-black ${stat.color}`}>
                  {stat.change} <ArrowUpRight className="h-3 w-3" />
                  <span className="text-slate-400 font-bold ml-1 uppercase tracking-tighter tracking-widest">vs Last Month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Recent Transactions</CardTitle>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px]">Real-time Updates</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">ID</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-right px-8">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ORDERS.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors border-slate-50">
                      <TableCell className="px-8 font-mono text-[11px] font-bold text-slate-500 uppercase">{order.id}</TableCell>
                      <TableCell className="py-5">
                        <div className="font-black text-slate-900">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`rounded-xl font-black px-4 py-1 text-[9px] uppercase tracking-widest ${
                            order.status === 'Shipped' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8 font-black text-slate-900 text-lg">
                        ${order.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Supply Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                {[
                  { title: "Low Stock: Smart Home Hub", desc: "Only 5 items remaining.", status: "Warning", color: "bg-orange-100 text-orange-600", border: "border-orange-200" },
                  { title: "Out of Stock: Office Chair", desc: "Listing hidden from store.", status: "Urgent", color: "bg-red-100 text-red-600", border: "border-red-200" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5 group">
                    <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
                      <Box className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-slate-900 leading-tight mb-1 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">{item.desc}</div>
                      <Badge variant="outline" className={`${item.color} ${item.border} rounded-lg text-[9px] font-black uppercase`}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-2xl rounded-3xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="h-24 w-24" />
              </div>
              <CardHeader className="p-0 mb-4 relative z-10">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-0 relative z-10 space-y-4">
                <div className="text-2xl font-black leading-tight">Your sales are up 25% compared to yesterday!</div>
                <p className="text-xs font-bold text-white/70 leading-relaxed">Consider increasing your marketing spend for 'Electronics' as it's the trending category today.</p>
                <Button className="w-full bg-white text-primary hover:bg-slate-100 font-black rounded-xl h-12 mt-4 transition-all active:scale-95">View Report</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
