
"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Save, Loader2, Database, AlertCircle, RefreshCw } from "lucide-react";
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, query, getDocs, writeBatch } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { syncKaggleData } from "@/ai/flows/kaggle-import-flow";

export default function AdminSettings() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

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
        title: "Settings Saved",
        description: "Your preferences have been updated.",
      });
    }, 1000);
  };

  const cleanDatabase = async () => {
    if (!db) return;
    setIsCleaning(true);
    try {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast({ title: "Database Cleaned", description: "All products have been removed." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Cleaning Failed", description: error.message });
    } finally {
      setIsCleaning(false);
    }
  };

  const syncWithKaggle = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    try {
      const result = await syncKaggleData();
      
      const seedPromises = result.products.map(product => {
        return addDoc(collection(db, 'products'), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await Promise.all(seedPromises);
      
      toast({
        title: "Kaggle Sync Complete",
        description: `${result.products.length} products mapped and imported from Kaggle-style dataset.`,
      });
      router.push('/admin/products');
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: 'products',
        operation: 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not connect to Kaggle AI Flow."
      });
    } finally {
      setIsSeeding(false);
    }
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-14 space-y-12 overflow-x-hidden">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">Settings</h1>
          <p className="text-slate-600 text-sm md:text-lg font-medium">Manage your admin account and global data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-6 md:p-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-widest">Admin Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</Label>
                    <Input defaultValue={user.displayName || "Admin User"} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</Label>
                    <Input defaultValue={user.email || ""} disabled className="h-12 rounded-xl bg-slate-100 border-none font-bold text-slate-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-6 md:p-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl text-primary">
                    <Database className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-widest">Global Data Operations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest">
                    <RefreshCw className="h-4 w-4 text-primary" /> Kaggle API Integration
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                    Synchronize your store with real-world e-commerce data modeled after Kaggle.
                  </p>
                  <Button 
                    onClick={syncWithKaggle} 
                    disabled={isSeeding || isCleaning}
                    variant="outline"
                    className="h-16 px-8 rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black uppercase tracking-widest transition-all w-full md:w-auto"
                  >
                    {isSeeding ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <RefreshCw className="h-5 w-5 mr-3" />}
                    {isSeeding ? "Syncing Kaggle Data..." : "Sync with Kaggle (AI)"}
                  </Button>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest">
                    <AlertCircle className="h-4 w-4" /> Danger Zone
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                    Remove all products currently in the database.
                  </p>
                  <Button 
                    onClick={cleanDatabase} 
                    disabled={isSeeding || isCleaning}
                    variant="ghost"
                    className="h-16 px-8 rounded-2xl text-red-500 hover:bg-red-50 font-black uppercase tracking-widest transition-all w-full md:w-auto"
                  >
                    {isCleaning ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : null}
                    {isCleaning ? "Cleaning..." : "Clear All Products"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white p-6 md:p-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Security</h3>
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
                    <span className="text-xs font-bold text-slate-700">Notifications</span>
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
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </aside>
        </div>
      </main>
    </div>
  );
}
