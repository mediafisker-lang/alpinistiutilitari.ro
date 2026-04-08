import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQBlock } from "@/components/site/faq-block";

export const metadata = buildMetadata({
  title: "Intrebari frecvente",
  description:
    "Răspunsuri utile despre cum funcționează platforma, cum trimiți o cerere și cum sunt selectate firmele de alpinism utilitar.",
  path: "/intrebari-frecvente",
});

export default function FaqPage() {
  const items = [
    {
      question: "Cererea mea ajunge automat la toate firmele?",
      answer: "Nu. Cererea este stocată în administrarea internă a platformei și este analizată manual înainte de follow-up.",
    },
    {
      question: "Pot selecta mai multe firme pentru aceeași cerere?",
      answer: "Da. Poți bifa mai multe firme, iar selecția se salvează împreună cu cererea ta.",
    },
    {
      question: "De ce există pagini pe județe și orașe?",
      answer: "Pentru că utilizatorii caută frecvent servicii locale, iar paginile locale ajută atât la orientarea rapidă, cât și la o indexare SEO mai bună.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Întrebări frecvente" }]} />
      <div className="mt-6 space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Întrebări frecvente</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Ghid rapid despre platformă, cereri de ofertă și paginile locale pentru alpinism utilitar.
          </p>
        </div>
        <FAQBlock items={items} />
      </div>
    </div>
  );
}
