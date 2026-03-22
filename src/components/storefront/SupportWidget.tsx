"use client"

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SupportWidget() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Array<{ role: "user" | "bot"; text: string; ts: string }>>([]);
  const [welcomed, setWelcomed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!user) {
      toast({ title: "Sign in required", description: "Please login to contact support." });
      return;
    }
    if (!message) {
      toast({ title: "Missing message", description: "Please type your message." });
      return;
    }

    const currentMessage = message;
    const senderName = name || user?.displayName || "User";
    const senderEmail = email || user?.email || "";
    setIsSending(true);
    let botReply = "Thanks! Our support team will follow up shortly.";
    try {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat((prev) => [...prev, { role: "user", text: message, ts: now }]);
      setIsTyping(true);
      setMessage("");

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          name: senderName,
          email: senderEmail,
          page: pathname,
        }),
      });
      if (res.ok) {
        try {
          const data = await res.json();
          if (data?.reply) botReply = data.reply;
        } catch {
          // ignore json parse errors
        }
      } else {
        botReply = "Support is currently unavailable. Please try again shortly.";
      }
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat((prev) => [...prev, { role: "bot", text: botReply, ts: botTime }]);
      setIsTyping(false);

      try {
        await addDoc(collection(db, "support_requests"), {
          name: senderName,
          email: senderEmail,
          message: currentMessage,
          botReply,
          page: pathname,
          status: "open",
          userId: user?.uid || null,
          createdAt: serverTimestamp(),
        });
      } catch {
        // keep chat UX smooth even if Firestore fails
        console.warn("Support request not saved to Firestore.");
      }

      toast({ title: "Message Sent", description: "AI replied. A human will follow up." });
    } catch {
      const fallback = "Support is currently unavailable. Please try again shortly.";
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat((prev) => [...prev, { role: "bot", text: fallback, ts: botTime }]);
      setIsTyping(false);
      try {
        await addDoc(collection(db, "support_requests"), {
          name: senderName,
          email: senderEmail,
          message: currentMessage,
          botReply: fallback,
          page: pathname,
          status: "open",
          userId: user?.uid || null,
          createdAt: serverTimestamp(),
        });
      } catch {
        // ignore firestore failures
      }
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (open && !welcomed) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat([{ role: "bot", text: "Hi! How can I help you today?", ts: now }]);
      setWelcomed(true);
    }
  }, [open, welcomed]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || "User");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [chat, isTyping, open]);

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 w-[90vw] max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-900">AI Support</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Online</div>
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
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div ref={listRef} className="h-56 overflow-y-auto space-y-3 pr-1">
              {chat.map((c, i) => (
                <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                      c.role === "user" ? "bg-slate-900 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    <div>{c.text}</div>
                    <div className={`mt-1 text-[9px] font-bold uppercase tracking-widest ${c.role === "user" ? "text-white/70" : "text-slate-400"}`}>
                      {c.ts}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-2xl rounded-bl-sm text-xs font-bold">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="flex-1 rounded-xl bg-slate-50 border-slate-200 resize-none text-xs font-medium"
                placeholder="Type your message..."
              />
              <Button
                type="submit"
                disabled={isSending}
                className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-primary text-white p-0"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
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
