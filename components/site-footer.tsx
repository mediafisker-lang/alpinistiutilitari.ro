import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>Portal MVP pentru o asociație de bloc în curs de formare.</p>
        <div className="flex gap-4">
          <Link href="/privacy">Confidențialitate</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
