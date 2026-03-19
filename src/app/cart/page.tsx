"use client"

import { Navbar } from "@/components/storefront/Navbar";
import { useCart } from "@/context/CartContext";
import { IndianRupee, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 max-w-[1500px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-6 shadow-sm">
            <div className="flex justify-between items-end border-b pb-4 mb-4">
              <h1 className="text-3xl font-medium">Shopping Cart</h1>
              <span className="text-sm text-gray-500 pb-1">Price</span>
            </div>

            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="h-48 w-48 relative mb-6">
                   <Image 
                    src="https://picsum.photos/seed/empty-cart/400/400" 
                    alt="Empty Cart" 
                    fill 
                    className="object-contain opacity-50"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Z-Mart Cart is empty</h2>
                <p className="text-sm text-gray-600 mb-6">Your shopping cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics, and more.</p>
                <Button asChild className="amazon-btn-primary rounded-md px-8">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b pb-6 last:border-0">
                    <div className="relative h-44 w-44 bg-gray-50 rounded-sm shrink-0 overflow-hidden">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        fill 
                        className="object-contain p-2"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-1">
                        <Link href="#" className="text-lg font-medium hover:text-[#c45500] hover:underline line-clamp-2">
                          {item.product.name}
                        </Link>
                        <span className="text-xl font-bold whitespace-nowrap">
                          {formatCurrency(item.product.price)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-green-600 font-medium mb-1">In stock</p>
                      <p className="text-xs text-gray-500 mb-2">Sold by Z-Mart Retail</p>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center gap-2 bg-gray-100 border rounded-md px-2 py-1 shadow-sm h-8">
                          <span className="text-xs text-gray-600">Qty:</span>
                          <Select 
                            value={item.quantity.toString()} 
                            onValueChange={(val) => updateQuantity(item.product.id, parseInt(val))}
                          >
                            <SelectTrigger className="border-none bg-transparent h-6 p-0 focus:ring-0 text-sm font-bold w-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-[#007185] hover:underline hover:text-[#c45500]"
                        >
                          Delete
                        </button>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <button className="text-xs text-[#007185] hover:underline hover:text-[#c45500]">
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-right pt-2">
                  <p className="text-lg">
                    Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}): 
                    <span className="font-bold ml-1">{formatCurrency(subtotal)}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 px-2">
            The price and availability of items at Z-Mart.in are subject to change. The shopping cart is a temporary place to store a list of your items and reflects each item's most recent price.
          </p>
        </div>

        {/* Right Column: Checkout Summary */}
        {items.length > 0 && (
          <div className="bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div className="leading-tight">
                <p className="text-xs font-bold">Your order is eligible for FREE Delivery.</p>
                <p className="text-xs">Choose FREE Delivery option at checkout.</p>
              </div>
            </div>

            <div className="text-lg">
              Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}): 
              <span className="font-bold block text-xl">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="gift" className="rounded-sm border-gray-300" />
              <label htmlFor="gift" className="text-xs cursor-pointer">This order contains a gift</label>
            </div>

            <Button className="amazon-btn-secondary w-full py-6 text-sm">
              Proceed to Buy
            </Button>
            
            <div className="border rounded-lg p-3 group cursor-pointer hover:bg-gray-50 transition-colors">
              <button className="flex items-center justify-between w-full text-sm font-medium">
                EMI Available <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-white border-t py-8 text-center text-xs text-gray-500">
        <p>© 1996-2024, Z-Mart.in, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}
