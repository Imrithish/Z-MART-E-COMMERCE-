
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      toast({
        title: "Account Created",
        description: `Welcome to Z-MART, ${name}!`,
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An error occurred during account creation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f3f3] p-4 font-body text-slate-900">
      <Link href="/" className="flex items-center gap-1 mb-8">
        <span className="text-3xl font-black tracking-tighter">Z-MART</span>
        <span className="text-xs mt-3 text-[#ff9900]">.in</span>
      </Link>

      <Card className="w-full max-w-[350px] shadow-sm border border-slate-200 rounded-lg bg-white p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-normal">Create account</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold">Your name</Label>
              <Input 
                id="name" 
                placeholder="First and last name"
                required 
                className="h-8 border-slate-400 focus-visible:ring-primary focus-visible:border-primary rounded-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold">Email</Label>
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
                placeholder="At least 6 characters"
                required 
                minLength={6}
                className="h-8 border-slate-400 focus-visible:ring-primary focus-visible:border-primary rounded-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 italic">Passwords must be at least 6 characters.</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-8 bg-[#ffd814] hover:bg-[#f7ca00] text-black border-[#fcd200] border shadow-sm rounded-sm font-normal text-sm"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify email"}
            </Button>
          </form>

          <p className="text-[11px] text-slate-600 leading-tight border-t border-slate-200 pt-4">
            By creating an account, you agree to Z-MART's <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>.
          </p>

          <div className="text-xs pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

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
