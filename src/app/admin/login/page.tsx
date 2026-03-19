"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto bg-primary h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Store className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Merchant Access</CardTitle>
            <CardDescription>Login to manage your Z-MART store</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="admin@zmart.com" required className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <Input id="password" type="password" required className="bg-muted/50" />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login to Dashboard"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="#" className="text-primary font-bold hover:underline">Register Store</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}