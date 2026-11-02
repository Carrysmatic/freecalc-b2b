import type { Metadata } from "next";
import Link from "next/link";
import pseoData from "@/data/pseo_routes.json";
import MultiRegionCalculator from "@/components/MultiRegionCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title:
    "Calculator Comisioane Procesatori Plăți România (2026) — Netopia, EuPlătesc, Stripe, eMAG",
  description:
    "Calculează instantaneu comisioanele Netopia, EuPlătesc, Stripe România și eMAG Marketplace, taxa pe carduri Non-SEE, schimbul valutar și suma brută de facturat (Reverse Gross-Up).",
};

export default function RomaniaHubPage() {
  const mainRoCalculators = pseoData.ro.filter((r) =>
    r.slug.startsWith("calculator-comision-")
  );
  const amountRoRoutes = pseoData.ro.filter(
    (r) => !r.slug.startsWith("calculator-comision-")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Calculator Comisioane Procesatori Plăți & e-Commerce România",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "RON",
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
            Hub FinTech B2B România • SRL / PFA / e-Commerce
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculator Comisioane Plăți Online & Brut-la-Net România
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Calculează exact cu câți bani rămâi în contul firmei după comisioanele
            Netopia, EuPlătesc, Stripe sau eMAG Marketplace și cât trebuie să
            facturezi (Reverse Gross-Up) ca să încasezi suma netă dorită.
          </p>
        </header>

        <AdSlot slotId="ro-hub-top" format="leaderboard" locale="ro" />

        <MultiRegionCalculator
          initialProcessorId="netopia-ro"
          initialAmount={1000}
          locale="ro"
        />

        <AdSlot slotId="ro-hub-mid" format="rectangle" locale="ro" />

        <section className="max-w-3xl mx-auto space-y-6 pt-6 border-t border-slate-800/80">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              Calculatoare Dedicate Procesatori România
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mainRoCalculators.map((route) => (
                <Link
                  key={route.slug}
                  href={`/ro/${route.slug}/`}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 hover:text-emerald-400 transition"
                >
                  {route.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Simulări Rapide pe Sume în RON
            </h3>
            <div className="flex flex-wrap gap-2">
              {amountRoRoutes.map((route) => (
                <Link
                  key={route.slug}
                  href={`/ro/${route.slug}/`}
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

