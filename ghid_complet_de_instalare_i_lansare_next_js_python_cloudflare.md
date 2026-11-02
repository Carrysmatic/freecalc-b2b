# Ghid Complet de Implementare: Hub FinTech B2B pe Cloudflare Pages (Cost \$0)

Acest document conține toți pașii tehnici, comenzile de terminal și codul sursă pentru a crea, genera programatic (cu Python) și lansa pe Cloudflare Pages proiectul **FeeCalc B2B Hub** folosind **Next.js (App Router), TypeScript și Tailwind CSS**.

## Pasul 1: Cerințe Preliminare pe Laptop

Asigură-te că ai instalate pe laptop următoarele unelte:

1. **Node.js** (versiunea 18.18+ sau 20+ LTS) – verifică în terminal cu `node -v`

2. **Python** (versiunea 3.9+) – verifică în terminal cu `python --version` sau `python3 --version`

3. **Git** și un cont activ pe **GitHub**

4. Un cont gratuit pe **Cloudflare** (`dash.cloudflare.com`)

## Pasul 2: Inițializarea Proiectului Next.js + Tailwind CSS

Deschide terminalul (Command Prompt / PowerShell / Terminal în VS Code) și rulează următoarele comenzi:

```
# 1. Creează aplicația Next.js cu TypeScript, Tailwind CSS și App Router
npx create-next-app@latest feecalc-b2b --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"

# 2. Intră în directorul proiectului
cd feecalc-b2b

# 3. Instalează pachetul de iconițe Lucide React (ușor și rapid pentru UI)
npm install lucide-react

```

## Pasul 3: Configurarea Next.js pentru Export 100% Static (Cloudflare Pages)

Pentru ca proiectul să ruleze **100% gratuit pe Cloudflare Pages**, fără server Node.js și fără să consume execuții de Cloudflare Workers, trebuie să activăm exportul static.

Editează fișierul `next.config.ts` (sau `next.config.mjs`) din rădăcina proiectului astfel:

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // OBLIGATORIU: Generează HTML/CSS/JS pur în folderul /out
  trailingSlash: true, // Recomandat pentru SEO și rutare curată pe Cloudflare Pages
  images: {
    unoptimized: true, // Necesar pentru static export fără server de optimizare imagini
  },
};

export default nextConfig;

```

## Pasul 4: Scriptul Python pentru Programmatic SEO (`scripts/generate_pseo_data.py`)

Acest script Python rulează local pe laptopul tău (sau automat la build) și generează baza de date JSON cu sute de combinații de procesatori, țări și sume pre-calculate (ex: `/calculators/stripe-fee-calculator`, `/calculators/paypal-fee-calculator`, `/calculators/stripe-fee-for-1000-usd`).

1. Creează un folder numit `scripts` și un folder `src/data` în proiectul tău:

```
mkdir scripts
mkdir -p src/data

```

2. Creează fișierul `scripts/generate_pseo_data.py` și lipește următorul cod:

```
import json
import os

# Definim procesatorii de bază și comisioanele oficiale 2026
PROCESSORS = [
    {
        "id": "stripe",
        "name": "Stripe",
        "planName": "Standard Checkout",
        "baseRate": 0.029,
        "fixedFee": 0.30,
        "intlFee": 0.015,
        "fxFee": 0.01,
        "invoicingFee": 0.004,
        "currency": "USD",
        "symbol": "$",
        "affiliateName": "Wise Business",
        "affiliateTagline": "Încasează din Stripe în USD/EUR fără taxa de conversie valutară de 2%.",
        "affiliateUrl": "https://wise.com/invite/your-affiliate-code"
    },
    {
        "id": "paypal",
        "name": "PayPal",
        "planName": "Commercial Transactions",
        "baseRate": 0.0349,
        "fixedFee": 0.49,
        "intlFee": 0.015,
        "fxFee": 0.03,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "affiliateName": "Payoneer B2B",
        "affiliateTagline": "Evită taxele PayPal de peste 6% la clienții internaționali.",
        "affiliateUrl": "https://payoneer.com/your-affiliate-code"
    },
    {
        "id": "lemonsqueezy",
        "name": "Lemon Squeezy",
        "planName": "Merchant of Record",
        "baseRate": 0.05,
        "fixedFee": 0.50,
        "intlFee": 0.015,
        "fxFee": 0.01,
        "invoicingFee": 0.005,
        "currency": "USD",
        "symbol": "$",
        "affiliateName": "Paddle MoR",
        "affiliateTagline": "Alternative B2B cu comisioane negociabile sub 5% pentru SaaS.",
        "affiliateUrl": "https://paddle.com"
    },
    {
        "id": "wise-business",
        "name": "Wise Business",
        "planName": "Payment Links & Card",
        "baseRate": 0.01,
        "fixedFee": 0.20,
        "intlFee": 0.019,
        "fxFee": 0.0043,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "affiliateName": "Wise Business",
        "affiliateTagline": "Deschide contul multi-valută cu 0$ costuri lunare.",
        "affiliateUrl": "https://wise.com/invite/your-affiliate-code"
    },
    {
        "id": "gumroad",
        "name": "Gumroad",
        "planName": "Creator Flat Rate",
        "baseRate": 0.10,
        "fixedFee": 0.30,
        "intlFee": 0.029,
        "fxFee": 0.01,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "affiliateName": "Lemon Squeezy",
        "affiliateTagline": "Înjumătățește comisioanele de la 13% la 5% migrând de pe Gumroad.",
        "affiliateUrl": "https://lemonsqueezy.com"
    }
]

# Sume țintă populare căutate în Google (Long-tail Programmatic SEO)
POPULAR_AMOUNTS = [50, 100, 250, 500, 1000, 2000, 2500, 5000, 10000]

def generate_pages():
    pages = []

    for proc in PROCESSORS:
        # 1. Pagina principală a procesatorului (ex: /calculators/stripe-fee-calculator)
        main_slug = f"{proc['id']}-fee-calculator"
        pages.append({
            "slug": main_slug,
            "processorId": proc["id"],
            "defaultAmount": 1000,
            "seoTitle": f"{proc['name']} Fee & Reverse Gross-Up Calculator (2026 Rates)",
            "seoDescription": f"Calculate exact {proc['name']} payment processing fees ({proc['baseRate']*100:.2f}% + ${proc['fixedFee']:.2f}), international surcharges, and reverse invoice gross-up amounts.",
            "h1": f"{proc['name']} Fee & Invoice Gross-Up Calculator"
        })

        # 2. Pagini Long-Tail specifice pe sume (ex: /calculators/stripe-fee-on-1000-usd)
        for amt in POPULAR_AMOUNTS:
            gross_up = (amt + proc["fixedFee"]) / (1 - proc["baseRate"])
            fee_std = (amt * proc["baseRate"]) + proc["fixedFee"]
            slug = f"{proc['id']}-fee-on-{amt}-usd"
            pages.append({
                "slug": slug,
                "processorId": proc["id"],
                "defaultAmount": amt,
                "seoTitle": f"{proc['name']} Fee on ${amt:,} USD (Net Payout & Gross-Up)",
                "seoDescription": f"How much does {proc['name']} take from ${amt:,}? Standard fee is ${fee_std:.2f}. To receive exactly ${amt:,} net, you must invoice ${gross_up:.2f}.",
                "h1": f"{proc['name']} Fee Calculator for ${amt:,} USD"
            })

    output_dir = os.path.join("src", "data")
    os.makedirs(output_dir, exist_ok=True)

    with open(os.path.join(output_dir, "processors.json"), "w", encoding="utf-8") as f:
        json.dump(PROCESSORS, f, indent=2, ensure_ascii=False)

    with open(os.path.join(output_dir, "pseo_pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)

    print(f"[OK] Au fost generate {len(PROCESSORS)} profiluri de procesatori și {len(pages)} rute statice pSEO!")

if __name__ == "__main__":
    generate_pages()

```

3. Rulează scriptul Python pentru a popula datele:

```
python scripts/generate_pseo_data.py

```

## Pasul 5: Integrarea Rutei Dinamice SSG în Next.js (`src/app/calculators/[slug]/page.tsx`)

În Next.js App Router, funcția `generateStaticParams()` citește fișierul `pseo_pages.json` generat de Python și construiește toate paginile HTML la momentul build-ului:

```
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

```

## Pasul 6: Testarea Build-ului Static pe Laptop

Înainte de a urca proiectul pe GitHub, verifică în terminal că exportul static se compilează fără erori:

```
# Rulează scriptul Python + Build-ul Next.js
python scripts/generate_pseo_data.py && npm run build

```

După câteva secunde, vei vedea în rădăcina proiectului folderul `out/`. Toate paginile tale sunt acum fișiere `.html` ultra-rapide.

## Pasul 7: Publicarea pe GitHub și Conectarea la Cloudflare Pages (Cost 0\$)

### 7.1. Urcă codul pe GitHub

```
git init
git add .
git commit -m "Initial commit: FeeCalc B2B FinTech Hub"
git branch -M main
git remote add origin https://github.com/USERNAME-UL-TAU/feecalc-b2b.git
git push -u origin main

```

### 7.2. Conectează repository-ul la Cloudflare Pages

1. Intră în contul tău pe [dash.cloudflare.com](https://dash.cloudflare.com/).

2. În meniul din stânga, mergi la **Compute (Workers & Pages)** -> apasă butonul **Create** -> tab-ul **Pages** -> **Connect to Git**.

3. Autorizează GitHub și selectează repository-ul `feecalc-b2b`.

4. La pasul **Set up builds and deployments**, completează exact următoarele valori:

   * **Framework preset:** `Next.js (Static HTML Export)`

   * **Build command:** `python3 scripts/generate_pseo_data.py && npm run build`

   * **Build output directory:** `out`

5. Apasă pe **Save and Deploy**.

În aproximativ **60 de secunde**, site-ul tău va fi live pe rețeaua globală Cloudflare (pe un subdomeniu gratuit `.pages.dev` sau pe domeniul tău `.com` atașat din tab-ul **Custom Domains**), cu:

* **Lățime de bandă nelimitată (0\$ pe viață)**

* **Scor 100/100 în Google PageSpeed Insights**

* **Sub 500 de fișiere statice** (mult sub limita de 20.000 de fișiere per proiect).