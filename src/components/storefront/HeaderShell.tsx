"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";

export function HeaderShell() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
