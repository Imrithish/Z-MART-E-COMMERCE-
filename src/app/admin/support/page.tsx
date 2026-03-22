"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSupportPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const supportQuery = useMemo(() => {
    if (!db || authLoading || !user) return null;
    return query(collection(db, "support_requests"), orderBy("createdAt", "desc"));
  }, [db, authLoading, user]);

  const { data: requests, loading } = useCollection(supportQuery);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-black text-slate-600 uppercase tracking-widest text-[10px]">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-x-hidden pt-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">Customer Care</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">All customer messages in one place.</p>
        </header>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 border-b border-slate-50">
            <CardTitle className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-widest">Support Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : requests && requests.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {requests.map((req: any) => (
                  <div key={req.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex items-center gap-4 md:w-1/3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{req.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {req.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                        <MessageCircle className="h-3 w-3" /> Message
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{req.message}</p>
                      {req.page && (
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Page: <span className="text-slate-600">{req.page}</span>
                        </div>
                      )}
                    </div>
                    <div className="md:w-56 flex items-center justify-start md:justify-end gap-2">
                      {req.email && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          onClick={() => {
                            const to = encodeURIComponent(req.email);
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}`, "_blank");
                          }}
                          aria-label={`Email ${req.email}`}
                        >
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          Email
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={async () => {
                          if (!db) return;
                          await deleteDoc(doc(db, "support_requests", req.id));
                        }}
                      >
                        Delete
                      </Button>
                      <Badge className="rounded-full px-3 py-1 font-black uppercase text-[8px] bg-slate-900 text-white border-none tracking-widest">
                        {req.status || "open"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">
                No support requests yet
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
