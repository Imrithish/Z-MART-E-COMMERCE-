
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function UserLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in to Z-MART.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Welcome to Z-MART",
        description: "Signed in with Google successfully.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: "Could not authenticate with Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f3f3] p-4 font-body text-slate-900">
      <Link href="/" className="flex items-center gap-1 mb-8">
        <span className="text-3xl font-black tracking-tighter">Z-MART</span>
        <span className="text-xs mt-3 text-[#ff9900]">.in</span>
      </Link>

      <Card className="w-full max-w-[350px] shadow-sm border border-slate-200 rounded-lg bg-white p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-normal">Sign in</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold">Email or mobile phone number</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                className="h-8 border-slate-400 focus-visible:ring-primary focus-visible:border-primary rounded-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-bold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-8 border-slate-400 focus-visible:ring-primary focus-visible:border-primary rounded-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-8 bg-[#ffd814] hover:bg-[#f7ca00] text-black border-[#fcd200] border shadow-sm rounded-sm font-normal text-sm"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
            </Button>
          </form>

          <p className="text-[11px] text-slate-600 leading-tight">
            By continuing, you agree to Z-MART's <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>.
          </p>

          <div className="pt-2">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-8 border-slate-300 shadow-sm rounded-sm text-xs gap-2"
              disabled={isLoading || isGoogleLoading}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-[350px] mt-6">
        <div className="relative mb-3 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300" />
          </div>
          <span className="relative bg-[#f3f3f3] px-2 text-[11px] text-slate-500">New to Z-MART?</span>
        </div>
        <Link href="/signup">
          <Button variant="outline" className="w-full h-8 border-slate-300 shadow-sm rounded-sm text-xs bg-slate-50 hover:bg-slate-100">
            Create your Z-MART account
          </Button>
        </Link>
      </div>

      <footer className="mt-10 border-t border-slate-300 pt-6 w-full max-w-[600px] flex flex-col items-center gap-3">
        <div className="flex gap-6 text-[11px] text-[#0066c0]">
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
        </div>
        <p className="text-[11px] text-slate-500">© 1996-2024, Z-Mart.in, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}
