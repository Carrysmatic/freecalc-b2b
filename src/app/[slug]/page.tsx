import Link from "next/link";
import pseoData from "@/data/pseo_routes.json";
import MultiRegionCalculator from "@/components/MultiRegionCalculator";
import AdSlot from "@/components/AdSlot";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return pseoData.en.map((route) => ({
    slug: route.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pseoData.en.find((r) => r.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function EnglishPseoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pseoData.en.find((r) => r.slug === slug);
  if (!page) notFound();

  const siblingRoutes = pseoData.en.filter(
    (r) => r.processorId === page.processorId && r.slug !== page.slug
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{page.title}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {page.description}
          </p>
        </header>

        <AdSlot slotId="en-pseo-top" format="leaderboard" locale="en" />

        <MultiRegionCalculator
          initialProcessorId={page.processorId}
          initialAmount={page.defaultAmount}
          locale="en"
        />

        <AdSlot slotId="en-pseo-bottom" format="rectangle" locale="en" />

        {siblingRoutes.length > 0 && (
          <section className="max-w-3xl mx-auto pt-6 border-t border-slate-800/80 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Related Fee Calculations
            </h2>
            <div className="flex flex-wrap gap-2">
              {siblingRoutes.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}/`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-emerald-400 transition"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

