"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isStandaloneLeadsAdmin = pathname === "/admin-cereri";

  if (isStandaloneLeadsAdmin) {
    return <main className="min-h-screen bg-[#f5f7f9]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
