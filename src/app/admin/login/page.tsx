"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back to the Merchant Dashboard.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-8 bg-slate-900 text-white">
            <div className="mx-auto bg-primary h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
              <Store className="h-7 w-7" />
            </div>
            <div className="space-y-1 pt-2">
              <CardTitle className="text-3xl font-black tracking-tighter">Merchant Access</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Login to manage your Z-MART store</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@zmart.com" 
                  required 
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl px-5 font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                  <Link href="#" className="text-[10px] text-primary hover:underline font-black uppercase tracking-widest">Forgot?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl px-5 font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {isLoading ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500">
                New merchant?{" "}
                <Link href="#" className="text-primary font-black hover:underline uppercase tracking-widest text-xs">Register Store</Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl flex gap-4">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Prototype Access</p>
            <p className="text-xs font-medium text-slate-600">Use your registered credentials to access the secure dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
