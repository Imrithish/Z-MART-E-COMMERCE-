import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function AdminProducts() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Products</h1>
            <p className="text-muted-foreground text-lg">Manage your catalog, stock, and descriptions.</p>
          </div>
          <Button asChild className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/admin/products/new">
              <Plus className="h-5 w-5 mr-2" /> Add New Product
            </Link>
          </Button>
        </header>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 bg-muted/30 border-none" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted border">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider">{product.category}</span>
                    </TableCell>
                    <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {product.stock} units
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/5 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}