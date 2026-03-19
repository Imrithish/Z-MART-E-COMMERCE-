
"use client"

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20 border-t border-white/5 w-full mt-auto">
      <div className="max-w-[1450px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Z-MART</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
            The premium gateway to modern commerce. Discover a curated collection of tech, fashion, and lifestyle essentials.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Digital Catalog</Link></li>
            <li><Link href="/account" className="hover:text-primary transition-colors">Member Dashboard</Link></li>
            <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Basket</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Support</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Usage</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Help Terminal</Link></li>
            <li><Link href="/admin/login" className="hover:text-primary transition-colors">Merchant Portal</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1450px] mx-auto px-8 mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2024 Z-MART GLOBAL OPERATIONS</p>
      </div>
    </footer>
  );
}
