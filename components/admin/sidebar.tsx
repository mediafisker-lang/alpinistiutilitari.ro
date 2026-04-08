import Link from "next/link";
import { LayoutDashboard, Building2, Map, MapPinned, Wrench, FileText, Inbox, LogOut, CircleHelp, Search } from "lucide-react";
import { adminLogoutAction } from "@/lib/actions/admin";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cereri", label: "Cereri", icon: Inbox },
  { href: "/admin/firme", label: "Firme", icon: Building2 },
  { href: "/admin/judete", label: "Judete", icon: Map },
  { href: "/admin/orase", label: "Orase", icon: MapPinned },
  { href: "/admin/servicii", label: "Servicii", icon: Wrench },
  { href: "/admin/articole", label: "Articole", icon: FileText },
  { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/import", label: "Import firme", icon: Inbox },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
        Administrare
      </p>
      <nav className="mt-5 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-sky-700"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <form action={adminLogoutAction} className="mt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </form>
    </aside>
  );
}
