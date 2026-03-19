"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Star, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function StorefrontProducts() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your shopping cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-white p-6 shadow-sm rounded-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
            <p className="text-sm text-gray-500">Showing all items in our premium collection.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 h-9 text-xs">
              <SlidersHorizontal className="h-4 w-4" /> Sort By
            </Button>
            <Button variant="outline" className="gap-2 h-9 text-xs">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-sm bg-white rounded-sm flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                <Image 
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardHeader className="pt-4 pb-2 px-4 space-y-1">
                <div className="text-[11px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer uppercase tracking-wider font-bold">{product.category}</div>
                <CardTitle className="text-base font-medium group-hover:text-[#c45500] transition-colors line-clamp-2 min-h-[3rem]">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                   <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-3 w-3 ${i <= Math.floor(product.rating) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#007185] ml-1">{product.reviews.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                   {product.originalPrice && (
                     <span className="text-xs text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                   )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Get it by Tomorrow, 10 AM</p>
                <p className="text-[11px] text-gray-500">FREE Delivery by Z-Mart</p>
              </CardContent>
              <CardFooter className="mt-auto px-4 pb-4 pt-0">
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="amazon-btn-primary w-full h-8 text-xs rounded-full"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
