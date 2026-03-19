
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Store, Save, Loader2 } from "lucide-react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Updated",
        description: "Your administrative preferences have been saved.",
      });
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-14 space-y-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-600 text-lg font-medium">Manage your merchant account and platform preferences.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Account Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Display Name</Label>
                    <Input defaultValue={user.displayName || "Merchant Admin"} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact Email</Label>
                    <Input defaultValue={user.email || ""} disabled className="h-12 rounded-xl bg-slate-100 border-none font-bold text-slate-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Store className="h-5 w-5 text-slate-600" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-widest">Store Configuration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marketplace Name</Label>
                  <Input defaultValue="Z-MART Premium Store" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support Phone Number</Label>
                  <Input defaultValue="+91 1234567890" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white p-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Security & Auth</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">Two-Factor Auth</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">Order Notifications</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full h-16 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </aside>
        </div>
      </main>
    </div>
  );
}
