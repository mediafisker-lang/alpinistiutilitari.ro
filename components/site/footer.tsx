import Link from "next/link";
import { getCounties, getServices } from "@/lib/data/queries";

const footerLinks = [
  { href: "/judete", label: "Judete" },
  { href: "/cere-oferta", label: "Cere oferta" },
  { href: "/firme", label: "Firme" },
  { href: "/despre-noi", label: "Despre platforma" },
  { href: "/blog", label: "Articole" },
];

export async function SiteFooter() {
  const [counties, services] = await Promise.all([getCounties(), getServices()]);
  const topCounties = counties.slice(0, 4);
  const topServices = services.slice(0, 5);
  const partnerLinks = [
    {
      href: "https://www.expertcopaci.ro",
      label: "www.expertcopaci.ro",
      description: "Specialiști în tăieri, toaletări și intervenții pentru arbori dificili.",
    },
    {
      href: "https://www.dubamarfa.ro",
      label: "www.dubamarfa.ro",
      description: "Transport rapid pentru materiale, moloz, echipamente și mutări punctuale.",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#07152e,#061125)] text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Lead generation pentru servicii la inaltime
          </p>
          <h2 className="max-w-2xl text-3xl font-bold text-white">
            Platforma care ajuta clientii sa gaseasca rapid firme de alpinism utilitar in Romania.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Structura SEO este gandita pe judete, orase, servicii, firme si articole.
            Obiectivul principal este inregistrarea unei cereri clare in platforma, urmata de selectie manuala a executantilor potriviti.
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Navigare rapidă
          </p>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 text-xs leading-6 text-slate-400">
            Cautări locale comerciale pe județe, orașe și servicii cu pagini optimizate pentru România.
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Site-uri recomandate
            </p>
            <div className="mt-3 space-y-3">
              {partnerLinks.map((partner) => (
                <a
                  key={partner.href}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-sky-300/40 hover:bg-white/8"
                >
                  <span className="block font-semibold text-sky-300">{partner.label}</span>
                  <span className="mt-1 block text-slate-300">{partner.description}</span>
                </a>
              ))}
            </div>
          </div>
          <p className="pt-4 text-slate-400">
            © {new Date().getFullYear()} AlpinistiUtilitari.ro
          </p>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Județe populare
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topCounties.map((county) => (
                <Link
                  key={county.id}
                  href={`/${county.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-300 hover:text-white"
                >
                  {county.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Servicii populare
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/servicii/${service.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-300 hover:text-white"
                >
                  {service.shortName ?? service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
