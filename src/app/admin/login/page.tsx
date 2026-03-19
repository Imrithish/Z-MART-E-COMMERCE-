"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Info, ArrowRight } from "lucide-react";
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
  const [email, setEmail] = useState("m.rithish1882007@gmail.com");
  const [password, setPassword] = useState("Rithish.m@2");

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
        description: "Invalid credentials. Please check your password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-body">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
            <Store className="h-6 w-6 text-primary" />
            Z-MART
          </Link>
        </div>

        <Card className="shadow-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-4 text-center pb-8 pt-10 px-8">
            <div className="mx-auto bg-slate-900 h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-3 mb-2">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900">Merchant Access</CardTitle>
              <CardDescription className="text-slate-600 font-medium">Manage your marketplace operations</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@zmart.com" 
                  required 
                  className="bg-slate-50 border-slate-300 h-14 rounded-2xl px-6 font-bold focus:ring-primary/20 transition-all text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-600">Security Password</Label>
                  <Link href="#" className="text-[10px] text-primary hover:underline font-black uppercase tracking-widest">Forgot Access?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="bg-slate-50 border-slate-300 h-14 rounded-2xl px-6 font-bold focus:ring-primary/20 transition-all text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-xs group" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {isLoading ? "Authenticating..." : "Login to Dashboard"}
                {!isLoading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-200 text-center">
              <p className="text-sm font-medium text-slate-600">
                Authorized access only. By logging in, you agree to the{" "}
                <Link href="#" className="text-primary font-black hover:underline uppercase tracking-widest text-[10px]">Merchant Terms</Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex gap-4 backdrop-blur-sm">
          <div className="bg-white h-10 w-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-primary/20">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Security Notice</p>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">This terminal is restricted to registered merchants. All access attempts are logged for security purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
