"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
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
        name: user.displayName || "User",
        email: user.email || "",
        subject: subject.trim() || "Support request",
        message: message.trim(),
        botReply: null,
        page: "/support",
        status: "open",
        userId: user.uid,
        source: "form",
        createdAt: serverTimestamp(),
      });
      setSubject("");
      setMessage("");
      toast({ title: "Request sent", description: "Our support team will contact you soon." });
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 md:px-8 py-10 md:py-14">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 md:p-10">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Support</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Tell us what you need and our support team will follow up.
            </p>
          </div>

          {!user ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Please sign in to submit a support request.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button asChild className="amazon-btn-primary">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Name</label>
                  <Input value={user.displayName || "User"} readOnly className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email</label>
                  <Input value={user.email || ""} readOnly className="bg-slate-50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order issue, payment, delivery, return..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" disabled={isSubmitting} className="amazon-btn-primary">
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
