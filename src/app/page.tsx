import Link from "next/link";
import pseoData from "@/data/pseo_routes.json";
import MultiRegionCalculator from "@/components/MultiRegionCalculator";
import AdSlot from "@/components/AdSlot";

export default function GlobalHubPage() {
  const mainCalculators = pseoData.en.filter((r) =>
    r.slug.endsWith("-fee-calculator")
  );
  const popularAmountRoutes = pseoData.en.filter(
    (r) => !r.slug.endsWith("-fee-calculator")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FeeCalc B2B Multi-Region Payment Fee & Gross-Up Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <span className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            Multi-Region B2B FinTech Hub • US • CA • EU • RO
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Payment Processing Fee & Reverse Gross-Up Calculator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Calculate exact net payouts, non-EEA / international card surcharges,
            FX conversion spreads, and reverse invoice gross-up totals across
            North America and Europe.
          </p>
        </header>

        <AdSlot slotId="global-hub-top" format="leaderboard" locale="en" />

        <MultiRegionCalculator
          initialProcessorId="stripe-us"
          initialAmount={1000}
          locale="en"
        />

        <AdSlot slotId="global-hub-mid" format="rectangle" locale="en" />

        <section className="max-w-3xl mx-auto space-y-6 pt-6 border-t border-slate-800/80">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              Dedicated Regional Processor Calculators (US, Canada, Europe)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mainCalculators.map((route) => (
                <Link
                  key={route.slug}
                  href={`/${route.slug}/`}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 hover:text-emerald-400 transition"
                >
                  {route.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Popular Amount Breakdowns
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularAmountRoutes.map((route) => (
                <Link
                  key={route.slug}
                  href={`/${route.slug}/`}
                  className="px-2.5 py-1 rounded-md bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-emerald-300 transition"
                >
                  {route.slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
