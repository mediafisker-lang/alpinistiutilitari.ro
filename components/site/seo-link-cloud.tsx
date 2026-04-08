import Link from "next/link";

type LinkItem = {
  href: string;
  label: string;
};

type SeoLinkCloudProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  links: LinkItem[];
};

export function SeoLinkCloud({ eyebrow, title, description, links }: SeoLinkCloudProps) {
  if (!links.length) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">{eyebrow}</p>
      ) : null}
      <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
