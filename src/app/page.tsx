import { Navbar } from "@/components/storefront/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ArrowRight, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/zmart1/1200/600"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="warehouse tech"
          />
          <div className="relative container mx-auto px-4 text-center text-white space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Future of Commerce
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Curated premium products for the modern lifestyle. Discover quality and innovation at Z-MART.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-white/10 border-white/20 hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked selections just for you.</p>
            </div>
            <Link href="/products" className="text-primary font-medium flex items-center gap-1 hover:underline">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-none bg-transparent">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image 
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                  </div>
                </div>
                <CardHeader className="px-0 pt-4 pb-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category}</div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="px-0 flex items-center justify-between">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  <Button variant="secondary" size="sm" className="rounded-full">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Values */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-primary-foreground/70">Free shipping on orders over $100. Delivered to your doorstep in 48 hours.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-primary-foreground/70">Every product is tested for quality and durability to ensure the best experience.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="text-primary-foreground/70">Our dedicated team is always here to help you with your purchases and questions.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="text-xl font-bold text-primary">Z-MART</h4>
            <p className="text-muted-foreground text-sm">Elevating your shopping experience with the best curated products online.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Shop</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="#">New Arrivals</Link></li>
              <li><Link href="#">Bestsellers</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Company</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Social</h5>
            <div className="flex gap-4">
               {/* Placeholders for social icons */}
               <div className="h-8 w-8 bg-muted rounded-full" />
               <div className="h-8 w-8 bg-muted rounded-full" />
               <div className="h-8 w-8 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 Z-MART Merchant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
