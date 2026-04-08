import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { adminLoginAction } from "@/lib/actions/admin";

export const metadata: Metadata = {
  title: "Login admin | AlpinistiUtilitari.ro",
  description: "Autentificare pentru administrarea internă a platformei.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Admin intern
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          Autentificare administrare
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Accesul este rezervat operatorilor care procesează cererile și conținutul intern.
        </p>

        <form action={adminLoginAction} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Parolă
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
              required
            />
          </div>

          {params.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {params.error}
            </p>
          ) : null}

          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Intră în admin
          </button>
        </form>
      </div>
    </div>
  );
}
