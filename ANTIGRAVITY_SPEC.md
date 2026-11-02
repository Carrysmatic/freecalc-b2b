1.Structura Arhitecturală Multi-Regiune (output: 'export')

fintech-fee-hub/
├── scripts/
│ └── sync_fees.py <-- Generează procesatorii (US, CA, EU, RO) + rutele pSEO
├── src/
│ ├── data/
│ │ ├── processors.json <-- Generat automat de Python
│ │ └── pseo_routes.json <-- Sute de pagini pre-calculate (EN + RO)
│ ├── lib/
│ │ └── feeMath.ts <-- Motorul matematic (TVA/GST, FX, Card Non-EEA, Gross-up)
│ ├── components/
│ │ ├── MultiRegionCalculator.tsx <-- UI-ul interactiv cu filtre pe regiuni
│ │ ├── AdSlot.tsx <-- Container Zero-CLS pentru AdSense/AdX
│ │ └── AffiliateBanner.tsx <-- Monetizare B2B (SmartBill/Wise/Stripe)
│ └── app/
│ ├── layout.tsx
│ ├── page.tsx <-- Hub-ul Global (EN)
│ ├── [slug]/
│ │ └── page.tsx <-- Pagini pSEO Globale (/mollie-fee-calculator-eu, etc.)
│ └── ro/
│ ├── page.tsx <-- Hub-ul România (/ro)
│ └── [slug]/
│ └── page.tsx <-- Pagini pSEO RO (/ro/calculator-comision-netopia)
└── next.config.ts

2.Scriptul Python Generator de Date & Rute pSEO (scripts/sync_fees.py)
Acest script populează procesatorii din SUA, Canada, Europa de Vest și România și creează rutele statice cu sume specifice (ex: 100, 500, 1000, 5000) pentru a captura căutările long-tail:

import json
import os

PROCESSORS = [
# --- GLOBAL / USA ---
{
"id": "stripe-us",
"name": "Stripe (US)",
"region": "US",
"lang": "en",
"currency": "USD",
"symbol": "$",
"baseRate": 0.029,
"fixedFee": 0.30,
"intlCardRate": 0.015,
"fxRate": 0.01,
"affiliateName": "Wise Business US",
"affiliatePitch": "Avoid Stripe's 1% FX conversion fee with a local multi-currency USD/EUR account.",
"affiliateUrl": "https://wise.com/"
},
{
"id": "paypal-us",
"name": "PayPal Commercial (US)",
"region": "US",
"lang": "en",
"currency": "USD",
"symbol": "$",
"baseRate": 0.0349,
"fixedFee": 0.49,
"intlCardRate": 0.015,
"fxRate": 0.03,
"affiliateName": "Stripe Atlas / Wise",
"affiliatePitch": "Cut PayPal's 3.49% + 3% FX fees by switching B2B invoices to direct ACH/Wire.",
"affiliateUrl": "https://wise.com/"
},
# --- CANADA (Tier-1, Low Competition) ---
{
"id": "stripe-ca",
"name": "Stripe Canada",
"region": "CA",
"lang": "en",
"currency": "CAD",
"symbol": "CA$",
"baseRate": 0.029,
"fixedFee": 0.30,
"intlCardRate": 0.008,
"fxRate": 0.02,
"affiliateName": "Float / Wise Canada",
"affiliatePitch": "Save 2% on USD-to-CAD payouts by settling Stripe USD directly to a Canadian USD account.",
"affiliateUrl": "https://wise.com/"
},
{
"id": "moneris-ca",
"name": "Moneris Canada (E-commerce)",
"region": "CA",
"lang": "en",
"currency": "CAD",
"symbol": "CA$",
"baseRate": 0.0285,
"fixedFee": 0.30,
"intlCardRate": 0.01,
"fxRate": 0.025,
"affiliateName": "Helcim Canada",
"affiliatePitch": "Processing over CA$10,000/mo? Switch to Interchange-Plus pricing and save up to 25%.",
"affiliateUrl": "https://helcim.com/"
},
# --- EUROPE & UK (High RPM, Low Competition) ---
{
"id": "stripe-eu",
"name": "Stripe Europe (EEA Cards)",
"region": "EU",
"lang": "en",
"currency": "EUR",
"symbol": "€",
"baseRate": 0.015,
"fixedFee": 0.25,
"intlCardRate": 0.0175, # UK / Non-EEA cards cost 3.25% total
"fxRate": 0.02,
"affiliateName": "Revolut Business EU",
"affiliatePitch": "Eliminate the 2% Stripe currency conversion fee across EUR, GBP, and USD.",
"affiliateUrl": "https://revolut.com/business"
},
{
"id": "mollie-eu",
"name": "Mollie (EU Cards & iDEAL)",
"region": "EU",
"lang": "en",
"currency": "EUR",
"symbol": "€",
"baseRate": 0.018,
"fixedFee": 0.25,
"intlCardRate": 0.0145,
"fxRate": 0.02,
"affiliateName": "Finom / Wise Business EU",
"affiliatePitch": "Optimize European B2B SEPA invoicing and cashback with Finom Business.",
"affiliateUrl": "https://finom.co/"
},
{
"id": "klarna-eu",
"name": "Klarna Merchant (Pay Now / BNPL)",
"region": "EU",
"lang": "en",
"currency": "EUR",
"symbol": "€",
"baseRate": 0.0329,
"fixedFee": 0.35,
"intlCardRate": 0.01,
"fxRate": 0.02,
"affiliateName": "Mollie Checkout",
"affiliatePitch": "Integrate Klarna, iDEAL, and SEPA under a single lower-cost European gateway.",
"affiliateUrl": "https://mollie.com/"
},
# --- ROMANIA (Fast SEO Ranking + Local B2B Affiliates) ---
{
"id": "netopia-ro",
"name": "Netopia Payments (România)",
"region": "RO",
"lang": "ro",
"currency": "RON",
"symbol": "lei",
"baseRate": 0.0099,
"fixedFee": 0.60, # ~0.12 EUR in RON
"intlCardRate": 0.01,
"fxRate": 0.015,
"affiliateName": "SmartBill / Oblio e-Factura",
"affiliatePitch": "Automatizează emiterea facturilor și trimiterea în SPV ANAF (e-Factura) direct din Netopia.",
"affiliateUrl": "https://smartbill.ro/"
},
{
"id": "euplatesc-ro",
"name": "EuPlătesc.ro",
"region": "RO",
"lang": "ro",
"currency": "RON",
"symbol": "lei",
"baseRate": 0.011,
"fixedFee": 0.50,
"intlCardRate": 0.012,
"fxRate": 0.015,
"affiliateName": "Keez Contabilitate Digitală",
"affiliatePitch": "Scapă de grija declarațiilor ANAF și e-Factura pentru SRL/PFA cu contabilitate online.",
"affiliateUrl": "https://keez.ro/"
},
{
"id": "stripe-ro",
"name": "Stripe România (Carduri SEE)",
"region": "RO",
"lang": "ro",
"currency": "RON",
"symbol": "lei",
"baseRate": 0.015,
"fixedFee": 1.00,
"intlCardRate": 0.0175,
"fxRate": 0.02,
"affiliateName": "Wise Business România",
"affiliatePitch": "Încasezi în EUR sau USD prin Stripe? Evită comisionul de 2% de schimb valutar la retragerea în RON.",
"affiliateUrl": "https://wise.com/"
},
{
"id": "emag-ro",
"name": "eMAG Marketplace (Medie Electronice/Home)",
"region": "RO",
"lang": "ro",
"currency": "RON",
"symbol": "lei",
"baseRate": 0.14, # 14% comision mediu categorie
"fixedFee": 0.00,
"intlCardRate": 0.00,
"fxRate": 0.00,
"affiliateName": "EasySales / SmartBill",
"affiliatePitch": "Sincronizează stocurile, AWB-urile și facturile pe eMAG, Trendyol și Altex dintr-un singur panou.",
"affiliateUrl": "https://easysales.ro/"
}
]

AMOUNTS_EN = [100, 250, 500, 1000, 2500, 5000, 10000]
AMOUNTS_RO = [100, 500, 1000, 2500, 5000, 10000]

def generate_pseo_routes():
en_routes = []
ro_routes = []

    for p in PROCESSORS:
        if p["lang"] == "en":
            # Main processor page
            base_slug = f"{p['id']}-fee-calculator"
            en_routes.append({
                "slug": base_slug,
                "processorId": p["id"],
                "defaultAmount": 1000,
                "title": f"{p['name']} Fee & Reverse Gross-Up Calculator (2026)",
                "description": f"Calculate exact {p['name']} processing fees ({p['baseRate']*100:.2f}% + {p['symbol']}{p['fixedFee']:.2f}), international card surcharges, and exact invoice gross-up in {p['currency']}."
            })
            # Amount-specific long-tail pages
            for amt in AMOUNTS_EN:
                en_routes.append({
                    "slug": f"{p['id']}-fee-on-{amt}-{p['currency'].lower()}",
                    "processorId": p["id"],
                    "defaultAmount": amt,
                    "title": f"{p['name']} Fee on {p['symbol']}{amt:,} {p['currency']} — Net Payout & Gross-Up",
                    "description": f"How much does {p['name']} take from {p['symbol']}{amt:,}? See exact net payout and how much to charge to receive {p['symbol']}{amt:,} net after fees."
                })
        else:
            # Romanian main processor page
            clean_id = p["id"].replace("-ro", "")
            base_slug = f"calculator-comision-{clean_id}"
            ro_routes.append({
                "slug": base_slug,
                "processorId": p["id"],
                "defaultAmount": 1000,
                "title": f"Calculator Comision {p['name']} & Brut-la-Net (2026)",
                "description": f"Calculează exact comisionul {p['name']} ({p['baseRate']*100:.2f}% + {p['fixedFee']:.2f} {p['symbol']}), taxa pentru carduri internaționale și suma brută de facturat."
            })
            for amt in AMOUNTS_RO:
                ro_routes.append({
                    "slug": f"comision-{clean_id}-la-{amt}-lei",
                    "processorId": p["id"],
                    "defaultAmount": amt,
                    "title": f"Cât este comisionul {p['name']} la {amt} RON? Calculator Net & Facturare",
                    "description": f"Vezi cu câți bani rămâi în firmă din {amt} lei încasați prin {p['name']} și cât trebuie să treci pe factură pentru a încasa {amt} lei net."
                })

    os.makedirs("src/data", exist_ok=True)
    with open("src/data/processors.json", "w", encoding="utf-8") as f:
        json.dump(PROCESSORS, f, indent=2, ensure_ascii=False)

    with open("src/data/pseo_routes.json", "w", encoding="utf-8") as f:
        json.dump({"en": en_routes, "ro": ro_routes}, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(PROCESSORS)} processors, {len(en_routes)} EN routes, and {len(ro_routes)} RO routes.")

if **name** == "**main**":
generate_pseo_routes()

3. Motorul Matematic și Componentele Next.js + TypeScript

A. src/lib/feeMath.ts
Include suport pentru carduri Non-EEA (Europa), conversie valutară (Canada/Global) și Reverse Gross-Up:

export interface Processor {
id: string;
name: string;
region: "US" | "CA" | "EU" | "RO";
lang: "en" | "ro";
currency: string;
symbol: string;
baseRate: number;
fixedFee: number;
intlCardRate: number;
fxRate: number;
affiliateName: string;
affiliatePitch: string;
affiliateUrl: string;
}

export interface CalculationInput {
amount: number;
mode: "gross_to_net" | "net_to_gross";
includeIntlCard: boolean;
includeFxConversion: boolean;
}

export function computeFees(processor: Processor, input: CalculationInput) {
const { amount, mode, includeIntlCard, includeFxConversion } = input;
if (amount <= 0) {
return { gross: 0, totalFee: 0, net: 0, effectiveRatePct: 0 };
}

const totalPercentageRate =
processor.baseRate +
(includeIntlCard ? processor.intlCardRate : 0) +
(includeFxConversion ? processor.fxRate : 0);

if (mode === "gross_to_net") {
const totalFee = amount _ totalPercentageRate + processor.fixedFee;
const net = Math.max(0, amount - totalFee);
const effectiveRatePct = (totalFee / amount) _ 100;
return { gross: amount, totalFee, net, effectiveRatePct };
} else {
// Reverse Gross-Up: Gross = (TargetNet + FixedFee) / (1 - TotalRate)
const gross = (amount + processor.fixedFee) / (1 - totalPercentageRate);
const totalFee = gross - amount;
const effectiveRatePct = (totalFee / gross) \* 100;
return { gross, totalFee, net: amount, effectiveRatePct };
}
}

B. src/components/MultiRegionCalculator.tsx
Componenta client-side care permite filtrarea instantanee între US, CA, EU și RO fără reîncărcarea paginii:

"use client";

import { useState, useMemo } from "react";
import processorsData from "@/data/processors.json";
import { Processor, computeFees } from "@/lib/feeMath";

const PROCESSORS = processorsData as Processor[];

interface Props {
initialProcessorId?: string;
initialAmount?: number;
locale?: "en" | "ro";
}

export default function MultiRegionCalculator({
initialProcessorId = "stripe-us",
initialAmount = 1000,
locale = "en",
}: Props) {
const defaultProc =
PROCESSORS.find((p) => p.id === initialProcessorId) || PROCESSORS[0];

const [regionFilter, setRegionFilter] = useState<"ALL" | "US" | "CA" | "EU" | "RO">(
defaultProc.region
);
const [selectedId, setSelectedId] = useState<string>(defaultProc.id);
const [amount, setAmount] = useState<number>(initialAmount);
const [mode, setMode] = useState<"gross_to_net" | "net_to_gross">("gross_to_net");
const [includeIntl, setIncludeIntl] = useState<boolean>(false);
const [includeFx, setIncludeFx] = useState<boolean>(false);

const filteredProcessors = useMemo(() => {
if (regionFilter === "ALL") return PROCESSORS;
return PROCESSORS.filter((p) => p.region === regionFilter);
}, [regionFilter]);

const activeProcessor =
PROCESSORS.find((p) => p.id === selectedId) || filteredProcessors[0];

const result = computeFees(activeProcessor, {
amount,
mode,
includeIntlCard: includeIntl,
includeFxConversion: includeFx,
});

const isRo = locale === "ro" || activeProcessor.region === "RO";

return (
<div className="w-full max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
{/_ Selector Regiune (US, Canada, EU, Romania) _/}
<div className="flex flex-wrap gap-2 mb-6">
{(["ALL", "US", "CA", "EU", "RO"] as const).map((reg) => (
<button
key={reg}
onClick={() => {
setRegionFilter(reg);
const firstInReg = PROCESSORS.find((p) => reg === "ALL" || p.region === reg);
if (firstInReg) setSelectedId(firstInReg.id);
}}
className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition ${
              regionFilter === reg
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`} >
{reg === "ALL" ? "Global (All)" : reg === "RO" ? "România (RON)" : reg}
</button>
))}
</div>

      {/* Comutator Mod: Standard vs Reverse Gross-Up */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
        <button
          onClick={() => setMode("gross_to_net")}
          className={`py-2.5 text-sm font-semibold rounded-lg transition ${
            mode === "gross_to_net"
              ? "bg-emerald-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isRo ? "Din Brut în Net (Cât rămâne)" : "Gross to Net (Payout)"}
        </button>
        <button
          onClick={() => setMode("net_to_gross")}
          className={`py-2.5 text-sm font-semibold rounded-lg transition ${
            mode === "net_to_gross"
              ? "bg-emerald-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isRo ? "Reverse Gross-Up (Cât facturezi)" : "Reverse Gross-Up (Invoice)"}
        </button>
      </div>

      {/* Input Procesator & Sumă */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1.5">
            {isRo ? "Procesator de Plăți / Platformă" : "Payment Processor"}
          </label>
          <select
            value={activeProcessor.id}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-white focus:border-emerald-500 focus:outline-none"
          >
            {filteredProcessors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({(p.baseRate * 100).toFixed(2)}% + {p.fixedFee} {p.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase text-slate-400 mb-1.5">
            {mode === "gross_to_net"
              ? isRo
                ? `Suma Încasată (${activeProcessor.currency})`
                : `Transaction Amount (${activeProcessor.currency})`
              : isRo
              ? `Suma Netă Dorită (${activeProcessor.currency})`
              : `Target Net Payout (${activeProcessor.currency})`}
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xl font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Opțiuni Card Internațional / Non-EEA și Schimb Valutar */}
      <div className="flex flex-wrap gap-6 mb-6 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeIntl}
            onChange={(e) => setIncludeIntl(e.target.checked)}
            className="rounded accent-emerald-500 w-4 h-4"
          />
          <span>
            {isRo ? "Card Internațional / Non-SEE" : "International / Non-EEA Card"} (+
            {(activeProcessor.intlCardRate * 100).toFixed(2)}%)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeFx}
            onChange={(e) => setIncludeFx(e.target.checked)}
            className="rounded accent-emerald-500 w-4 h-4"
          />
          <span>
            {isRo ? "Conversie Valutară (FX)" : "Currency Conversion (FX)"} (+
            {(activeProcessor.fxRate * 100).toFixed(2)}%)
          </span>
        </label>
      </div>

      {/* Rezultate Instantanee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase">
            {isRo ? "Total pe Factură (Brut)" : "Gross Invoice"}
          </span>
          <p className="text-2xl font-mono font-bold text-white mt-1">
            {result.gross.toFixed(2)} {activeProcessor.symbol}
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase">
            {isRo ? "Comision Reținut" : "Processor Fee"} ({result.effectiveRatePct.toFixed(2)}%)
          </span>
          <p className="text-2xl font-mono font-bold text-rose-400 mt-1">
            -{result.totalFee.toFixed(2)} {activeProcessor.symbol}
          </p>
        </div>

        <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-700/50">
          <span className="text-xs text-emerald-300 uppercase">
            {isRo ? "Bani în Cont (Net)" : "Net Payout in Bank"}
          </span>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            {result.net.toFixed(2)} {activeProcessor.symbol}
          </p>
        </div>
      </div>

      {/* Card Afiliere Contextual (Imun la AdBlock) */}
      <div className="p-4 bg-slate-950 border border-emerald-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded font-semibold">
            {isRo ? "Optimizare Costuri B2B" : "Fee Optimization Tip"}
          </span>
          <h4 className="font-bold text-white mt-1">{activeProcessor.affiliateName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{activeProcessor.affiliatePitch}</p>
        </div>
        <a
          href={activeProcessor.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
        >
          {isRo ? "Vezi Soluția →" : "Compare Rates →"}
        </a>
      </div>
    </div>

);
}

C. Rutele Dinamice Statice: Global (src/app/[slug]/page.tsx) și România (src/app/ro/[slug]/page.tsx)
Pentru Global (SUA, Canada, UE) — src/app/[slug]/page.tsx:
import pseoData from "@/data/pseo_routes.json";
import MultiRegionCalculator from "@/components/MultiRegionCalculator";
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

return (
<main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
<div className="max-w-4xl mx-auto space-y-8">
<header className="text-center space-y-3">
<h1 className="text-3xl sm:text-4xl font-extrabold text-white">{page.title}</h1>
<p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
{page.description}
</p>
</header>

        <MultiRegionCalculator
          initialProcessorId={page.processorId}
          initialAmount={page.defaultAmount}
          locale="en"
        />
      </div>
    </main>

);
}

Pentru România (/ro/[slug]) — src/app/ro/[slug]/page.tsx:

import pseoData from "@/data/pseo_routes.json";
import MultiRegionCalculator from "@/components/MultiRegionCalculator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
return pseoData.ro.map((route) => ({
slug: route.slug,
}));
}

export async function generateMetadata({
params,
}: {
params: Promise<{ slug: string }>;
}): Promise<Metadata> {
const { slug } = await params;
const page = pseoData.ro.find((r) => r.slug === slug);
if (!page) return {};
return {
title: page.title,
description: page.description,
};
}

export default async function RomanianPseoPage({
params,
}: {
params: Promise<{ slug: string }>;
}) {
const { slug } = await params;
const page = pseoData.ro.find((r) => r.slug === slug);
if (!page) notFound();

return (
<main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
<div className="max-w-4xl mx-auto space-y-8">
<header className="text-center space-y-3">
<h1 className="text-3xl sm:text-4xl font-extrabold text-white">{page.title}</h1>
<p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
{page.description}
</p>
</header>

        <MultiRegionCalculator
          initialProcessorId={page.processorId}
          initialAmount={page.defaultAmount}
          locale="ro"
        />
      </div>
    </main>

);
}
