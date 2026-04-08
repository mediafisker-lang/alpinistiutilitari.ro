type FAQItem = {
  id?: string;
  question: string;
  answer: string;
};

type FAQBlockProps = {
  title?: string;
  items: FAQItem[];
};

export function FAQBlock({ title = "Întrebări frecvente", items }: FAQBlockProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <details key={item.id ?? `${item.question}-${index}`} className="group rounded-3xl border border-slate-200 p-5">
            <summary className="cursor-pointer list-none font-semibold text-slate-950">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
