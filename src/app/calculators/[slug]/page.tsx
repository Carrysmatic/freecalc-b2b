import { Metadata } from "next";
import pseoPages from "@/data/pseo_pages.json";
import processors from "@/data/processors.json";
import FeeCalculatorClient from "@/components/FeeCalculatorClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. Spune lui Next.js să pre-randeze static toate paginile din JSON
export async function generateStaticParams() {
  return pseoPages.map((page) => ({
    slug: page.slug,
  }));
}

// 2. Generează metadatele SEO (Title, Description) specifice fiecărei pagini
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = pseoPages.find((p) => p.slug === slug) || pseoPages[0];

  return {
    title: pageData.seoTitle,
    description: pageData.seoDescription,
    alternates: {
      canonical: `https://feecalc.io/calculators/${pageData.slug}/`,
    },
  };
}

// 3. Randează pagina statică + Schema.org JSON-LD pentru Google Rich Snippets
export default async function CalculatorSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = pseoPages.find((p) => p.slug === slug) || pseoPages[0];
  const processor = processors.find((p) => p.id === pageData.processorId) || processors[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": pageData.h1,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeeCalculatorClient
        initialProcessorId={processor.id}
        initialAmount={pageData.defaultAmount}
        customHeading={pageData.h1}
        customDescription={pageData.seoDescription}
      />
    </div>
  );
}

