import { Navbar } from "@/components/storefront/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Star, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function StorefrontProducts() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground text-lg">Browse our collection of premium quality goods.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Sort By
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-lg bg-white rounded-3xl">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image 
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardHeader className="pt-6 pb-2">
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category}</div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs text-muted-foreground ml-1">(120 reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                <Button className="rounded-full px-6">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}