"use client";

import { usePathname } from "next/navigation";
import { SupportFloat } from "@/components/storefront/SupportFloat";

export function SupportFloatShell() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SupportFloat />;
}
