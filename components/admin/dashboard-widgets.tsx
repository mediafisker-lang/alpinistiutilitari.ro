type AdminDashboardWidgetsProps = {
  stats: {
    companies: number;
    activeCompanies: number;
    leads: number;
    articles: number;
    counties: number;
  };
};

export function AdminDashboardWidgets({ stats }: AdminDashboardWidgetsProps) {
  const items = [
    { label: "Firme totale", value: stats.companies },
    { label: "Firme publicate", value: stats.activeCompanies },
    { label: "Cereri primite", value: stats.leads },
    { label: "Articole", value: stats.articles },
    { label: "Judete active", value: stats.counties },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
