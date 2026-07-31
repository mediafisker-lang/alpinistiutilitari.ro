"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

type FilterOption = { value: string; label: string };
type CountyOption = { id: string; name: string; slug: string };

export function ServiceFilters({
  categories,
  counties,
  workTypes,
  selectedCategory,
  selectedCountySlug,
  selectedWorkType,
  minimumCompanies,
}: {
  categories: readonly FilterOption[];
  counties: readonly CountyOption[];
  workTypes: readonly FilterOption[];
  selectedCategory: string;
  selectedCountySlug: string;
  selectedWorkType: string;
  minimumCompanies: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(16,42,67,0.06)]">
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="service-filter-fields"
        onClick={() => setMobileOpen((open) => !open)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-extrabold text-[#102A43] lg:pointer-events-none"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-[#0063F7]" />
          Filtrează serviciile
        </span>
        <ChevronDown className={`size-4 text-[#0063F7] transition lg:hidden ${mobileOpen ? "rotate-180" : ""}`} />
      </button>

      <form
        id="service-filter-fields"
        action="/servicii"
        className={`${mobileOpen ? "block" : "hidden"} space-y-5 border-t border-slate-100 p-5 lg:block`}
      >
        <label className="block space-y-2 text-xs font-bold text-[#334E68]">
          <span>Categorie</span>
          <select name="categorie" defaultValue={selectedCategory} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#0063F7]">
            {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>

        <label className="block space-y-2 text-xs font-bold text-[#334E68]">
          <span>Județ</span>
          <select name="judet" defaultValue={selectedCountySlug} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#0063F7]">
            <option value="">Toate județele</option>
            {counties.map((county) => <option key={county.id} value={county.slug}>{county.name}</option>)}
          </select>
        </label>

        <label className="block space-y-2 text-xs font-bold text-[#334E68]">
          <span>Tip lucrare</span>
          <select name="tip" defaultValue={selectedWorkType} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#0063F7]">
            {workTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>

        <label className="block space-y-2 text-xs font-bold text-[#334E68]">
          <span>Număr firme</span>
          <select name="firme" defaultValue={String(minimumCompanies)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#0063F7]">
            <option value="0">Orice număr</option>
            <option value="1">Cel puțin o firmă</option>
            <option value="10">Minimum 10 firme</option>
            <option value="50">Minimum 50 firme</option>
          </select>
        </label>

        <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B0B] text-sm font-extrabold text-white shadow-[0_9px_20px_rgba(255,107,11,0.2)] transition hover:bg-[#E85E00]">
          Aplică filtrele
          <SlidersHorizontal className="size-4" />
        </button>
        <Link href="/servicii" className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0063F7]">
          <RotateCcw className="size-3.5" />
          Curăță filtrele
        </Link>
      </form>
    </div>
  );
}
