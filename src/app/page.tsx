import FeeCalculatorClient from "@/components/FeeCalculatorClient";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FeeCalc B2B — Payment Fee & Reverse Gross-Up Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeeCalculatorClient initialProcessorId="stripe" initialAmount={1000} />
    </>
  );
}
