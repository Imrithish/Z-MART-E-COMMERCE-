"use client"

import Link from "next/link";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
            Z-MART
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
            <Link href="/deals" className="hover:text-primary transition-colors">Deals</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative w-64 mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9 bg-muted/50 border-none h-9" />
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/admin/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/products" className="text-lg font-medium">Shop All</Link>
                <Link href="/categories" className="text-lg font-medium">Categories</Link>
                <Link href="/admin/login" className="text-lg font-medium">Merchant Login</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}