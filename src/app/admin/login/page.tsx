"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Info, ArrowRight, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("m.rithish1882007@gmail.com");
  const [password, setPassword] = useState("Rithish.m@2");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Access Verified",
        description: "Entering the Admin Dashboard.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      let message = "Security check failed. Please verify your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "Account not identified or incorrect security key.";
      }
      setErrorMessage(message);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 font-body overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="w-full max-w-md relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 text-white font-black text-4xl tracking-tighter hover:scale-105 transition-transform">
            <ShieldCheck className="h-10 w-10 text-primary" />
            Z-MART ADMIN
          </Link>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Administrative Access</p>
        </div>

        <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white p-2">
          <CardHeader className="space-y-4 text-center pb-10 pt-12 px-10">
            <div className="mx-auto bg-slate-950 h-20 w-20 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl -rotate-6 mb-4 animate-float">
              <Store className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-950 uppercase">Admin Portal</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Secure authentication for store management.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            {errorMessage && (
              <Alert variant="destructive" className="mb-8 rounded-2xl bg-red-50 border-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-black uppercase tracking-widest leading-relaxed">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="bg-slate-50 border-none h-16 rounded-2xl px-8 font-bold focus:ring-primary/20 transition-all text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-slate-50 border-none h-16 rounded-2xl px-8 font-bold focus:ring-primary/20 transition-all text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-20 bg-slate-950 hover:bg-slate-900 text-white font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/20 active:scale-95 transition-all text-xs group" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : null}
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Authorized Personnel Only • Secure 256-bit Encryption
        </p>
      </div>
    </div>
  );
}
