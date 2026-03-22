"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SupportFloat() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!user) {
      toast({ title: "Sign in required", description: "Please login to contact support." });
      return;
    }
    if (!message.trim()) {
      toast({ title: "Missing message", description: "Please describe your issue." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "support_requests"), {
        name: user.displayName || user.email || "User",
        email: user.email || "",
        subject: subject.trim() || "Support request",
        message: message.trim(),
        botReply: null,
        page: "floating-form",
        status: "open",
        userId: user.uid,
        source: "floating-form",
        createdAt: serverTimestamp(),
      });
      setSubject("");
      setMessage("");
      toast({ title: "Request sent", description: "Our support team will contact you soon." });
      setOpen(false);
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[90vw] max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-900">Support</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Contact Us</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!user ? (
            <div className="p-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-700">
                  Please sign in to send a support request.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Name</label>
                  <Input
                    value={user?.displayName || user?.email || "User"}
                    readOnly
                    className="text-xs bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email</label>
                  <Input
                    value={user?.email || ""}
                    readOnly
                    className="text-xs bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order, payment, delivery..."
                  className="text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue..."
                  className="resize-none text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-primary text-white text-xs font-black uppercase tracking-widest"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:bg-primary transition-colors"
        aria-label="Support"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
