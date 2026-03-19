import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, TrendingUp, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$12,845.00', icon: DollarSign, change: '+12.5%', color: 'text-green-600' },
    { label: 'Active Orders', value: '45', icon: ShoppingCart, change: '+5', color: 'text-blue-600' },
    { label: 'New Customers', value: '1,240', icon: Users, change: '+18%', color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '+0.4%', color: 'text-orange-600' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back to your merchant control panel.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg bg-muted`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 font-medium ${stat.color}`}>
                  {stat.change} <ArrowUpRight className="h-3 w-3" />
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ORDERS.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Shipped' ? 'default' : 'secondary'} className="rounded-full font-medium">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Box className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">Low Stock: Smart Home Hub</div>
                  <div className="text-xs text-muted-foreground">Only 5 items remaining in stock.</div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200">Restock</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <Box className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">Out of Stock: Office Chair</div>
                  <div className="text-xs text-muted-foreground">Product listing is currently hidden.</div>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-200">Urgent</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}