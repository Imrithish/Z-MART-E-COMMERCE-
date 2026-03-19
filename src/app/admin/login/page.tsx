
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

  // Redirect if already logged in
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
        title: "Access Granted",
        description: "Welcome back to the Merchant Dashboard.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      let message = "Invalid credentials. Please check your password and try again.";
      
      if (error.code === 'auth/invalid-api-key' || error.message?.includes('api-key-not-valid')) {
        message = "Critical Error: Your Firebase API Key is missing or invalid. Please check 'src/firebase/config.ts'.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "Account not found or incorrect credentials. Ensure this user exists in your Firebase Console.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Sign-in provider is not enabled. Enable Email/Password in your Firebase Console.";
      }

      setErrorMessage(message);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    setErrorMessage(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Merchant Verified",
        description: "Welcome to the Merchant Dashboard.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Google Login Error:", error.code, error.message);
      let message = "An error occurred during Google sign-in. Ensure Google provider is enabled in Firebase.";
      setErrorMessage(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-body text-slate-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Z-MART MERCHANT
          </Link>
        </div>

        <Card className="shadow-2xl border border-slate-200 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-4 text-center pb-8 pt-10 px-8">
            <div className="mx-auto bg-slate-900 h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-3 mb-2">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900 uppercase">Merchant Portal</CardTitle>
              <CardDescription className="text-slate-600 font-medium">Secure access to catalog and order management</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            {errorMessage && (
              <Alert variant="destructive" className="mb-6 rounded-2xl bg-red-50 border-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-black uppercase tracking-widest text-[10px]">Setup Required</AlertTitle>
                <AlertDescription className="text-xs font-bold leading-relaxed space-y-2">
                  <p className="text-red-600">{errorMessage}</p>
                  <Link 
                    href="https://console.firebase.google.com/" 
                    target="_blank" 
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Open Firebase Console <ExternalLink className="h-3 w-3" />
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Merchant Email</Label>
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
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-600">Security Key</Label>
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
              <Button type="submit" className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-xs group" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {isLoading ? "Verifying Credentials..." : "Access Dashboard"}
                {!isLoading && !isGoogleLoading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-white px-4 text-slate-400">Merchant SSO</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm text-slate-900"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
