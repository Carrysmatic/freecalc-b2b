"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRightLeft,
  Globe,
  ShieldCheck,
  TrendingDown,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  Sparkles,
  Layers,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import processorsData from "@/data/processors.json";
import pseoPages from "@/data/pseo_pages.json";

export interface Processor {
  id: string;
  slug?: string;
  name: string;
  planName: string;
  category?: string;
  baseRate: number;
  fixedFee: number;
  intlFee: number;
  fxFee: number;
  invoicingFee: number;
  currency: string;
  symbol: string;
  payoutSpeed?: string;
  chargebackFee?: number;
  affiliateName: string;
  affiliateTagline: string;
  affiliateCtaText?: string;
  affiliateCommissionNote?: string;
  affiliateBadge?: string;
  affiliateUrl: string;
  seoTitle?: string;
  seoDescription?: string;
}

type CalcMode = "gross_to_net" | "reverse_gross_up";

interface CalcOptions {
  isInternational: boolean;
  needsCurrencyConversion: boolean;
  includeAddonFee: boolean;
  monthlyTxCount: number;
}

interface ProcessorMetrics {
  grossAmount: number;
  netPayout: number;
  totalFee: number;
  effectiveRatePercent: number;
  baseFeePart: number;
  intlFeePart: number;
  fxFeePart: number;
  addonFeePart: number;
  monthlyGross: number;
  monthlyNet: number;
  monthlyFeesLost: number;
  annualFeesLost: number;
}

const PROCESSORS: Processor[] = processorsData as Processor[];

// ============================================================================
// MOTORUL MATEMATIC PUR (TypeScript / ES6 - Execuție 0ms în Browser)
// ============================================================================
function computeProcessorMetrics(
  amount: number | string,
  mode: CalcMode,
  processor: Processor,
  options: CalcOptions
): ProcessorMetrics {
  const {
    isInternational,
    needsCurrencyConversion,
    includeAddonFee,
    monthlyTxCount,
  } = options;

  const cleanAmount = Math.max(0, Number(amount) || 0);
  if (cleanAmount === 0) {
    return {
      grossAmount: 0,
      netPayout: 0,
      totalFee: 0,
      effectiveRatePercent: 0,
      baseFeePart: 0,
      intlFeePart: 0,
      fxFeePart: 0,
      addonFeePart: 0,
      monthlyGross: 0,
      monthlyNet: 0,
      monthlyFeesLost: 0,
      annualFeesLost: 0,
    };
  }

  const activePercentageRate =
    processor.baseRate +
    (isInternational ? processor.intlFee : 0) +
    (needsCurrencyConversion ? processor.fxFee : 0) +
    (includeAddonFee ? processor.invoicingFee : 0);

  const fixedFee = processor.fixedFee;

  let grossAmount = 0;
  let netPayout = 0;
  let totalFee = 0;

  if (mode === "gross_to_net") {
    grossAmount = cleanAmount;
    totalFee = grossAmount * activePercentageRate + fixedFee;
    netPayout = Math.max(0, grossAmount - totalFee);
  } else {
    netPayout = cleanAmount;
    const denominator = Math.max(0.01, 1 - activePercentageRate);
    grossAmount = (netPayout + fixedFee) / denominator;
    totalFee = grossAmount - netPayout;
  }

  const baseFeePart = grossAmount * processor.baseRate + fixedFee;
  const intlFeePart = isInternational ? grossAmount * processor.intlFee : 0;
  const fxFeePart = needsCurrencyConversion ? grossAmount * processor.fxFee : 0;
  const addonFeePart = includeAddonFee
    ? grossAmount * processor.invoicingFee
    : 0;

  const effectiveRatePercent =
    grossAmount > 0 ? (totalFee / grossAmount) * 100 : 0;

  const txCount = Math.max(1, Number(monthlyTxCount) || 1);
  const monthlyGross = grossAmount * txCount;
  const monthlyNet = netPayout * txCount;
  const monthlyFeesLost = totalFee * txCount;
  const annualFeesLost = monthlyFeesLost * 12;

  return {
    grossAmount,
    netPayout,
    totalFee,
    effectiveRatePercent,
    baseFeePart,
    intlFeePart,
    fxFeePart,
    addonFeePart,
    monthlyGross,
    monthlyNet,
    monthlyFeesLost,
    annualFeesLost,
  };
}

// ============================================================================
// COMPONENTA SLOT PUBLICITAR ANTI-CLS + SMART AD REFRESH (Viewability-based)
// ============================================================================
function ZeroClsAdSlot({
  slotId,
  format = "leaderboard",
  refreshIntervalSec = 35,
}: {
  slotId: string;
  format?: "leaderboard" | "rectangle";
  refreshIntervalSec?: number;
}) {
  const [secondsLeft, setSecondsLeft] = useState(refreshIntervalSec);
  const [impressionCount, setImpressionCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setImpressionCount((c) => c + 1);
          return refreshIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [refreshIntervalSec]);

  const heightClass =
    format === "leaderboard"
      ? "min-h-[110px] sm:min-h-[90px]"
      : "min-h-[250px]";

  return (
    <div
      className={`w-full ${heightClass} bg-slate-900/70 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden transition-colors`}
      aria-label={`Advertisement Slot ${slotId}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
          AD SLOT: {slotId}
        </span>
        <span>•</span>
        <span>Zero-CLS Reserved Container</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-emerald-400 font-mono">
          <RefreshCw
            className="w-3 h-3 animate-spin"
            style={{ animationDuration: "6s" }}
          />
          Smart Refresh: {secondsLeft}s (Imp #{impressionCount})
        </span>
      </div>

      <div className="text-center max-w-lg">
        <p className="text-xs font-medium text-slate-300">
          [ Spațiu Rezervat Google AdSense / Mediavine / AdX High-RPM FinTech
          Banner ]
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Traficul B2B pe cuvinte cheie „Stripe / PayPal Fee Calculator”
          generează un RPM mediu de{" "}
          <strong className="text-emerald-400">$18 – $35 USD</strong>.
        </p>
      </div>
    </div>
  );
}

export interface FeeCalculatorClientProps {
  initialProcessorId?: string;
  initialAmount?: number;
  customHeading?: string;
  customDescription?: string;
}

export default function FeeCalculatorClient({
  initialProcessorId = "stripe",
  initialAmount = 1000,
  customHeading,
  customDescription,
}: FeeCalculatorClientProps) {
  const [selectedProcessorId, setSelectedProcessorId] =
    useState<string>(initialProcessorId);
  const [calcMode, setCalcMode] = useState<CalcMode>("reverse_gross_up");
  const [inputAmount, setInputAmount] = useState<string | number>(
    initialAmount
  );
  const [monthlyTxCount, setMonthlyTxCount] = useState<number>(25);

  const [isInternational, setIsInternational] = useState<boolean>(true);
  const [needsCurrencyConversion, setNeedsCurrencyConversion] =
    useState<boolean>(false);
  const [includeAddonFee, setIncludeAddonFee] = useState<boolean>(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeProcessor = useMemo(() => {
    return (
      PROCESSORS.find((p) => p.id === selectedProcessorId) || PROCESSORS[0]
    );
  }, [selectedProcessorId]);

  const currentMetrics = useMemo(() => {
    return computeProcessorMetrics(inputAmount, calcMode, activeProcessor, {
      isInternational,
      needsCurrencyConversion,
      includeAddonFee,
      monthlyTxCount,
    });
  }, [
    inputAmount,
    calcMode,
    activeProcessor,
    isInternational,
    needsCurrencyConversion,
    includeAddonFee,
    monthlyTxCount,
  ]);

  const comparisonMatrix = useMemo(() => {
    return PROCESSORS.map((proc) => {
      const metrics = computeProcessorMetrics(inputAmount, calcMode, proc, {
        isInternational,
        needsCurrencyConversion,
        includeAddonFee,
        monthlyTxCount,
      });
      return {
        processor: proc,
        metrics,
      };
    }).sort((a, b) => a.metrics.totalFee - b.metrics.totalFee);
  }, [
    inputAmount,
    calcMode,
    isInternational,
    needsCurrencyConversion,
    includeAddonFee,
    monthlyTxCount,
  ]);

  const bestAlternative = comparisonMatrix[0];
  const potentialAnnualSavings = Math.max(
    0,
    currentMetrics.annualFeesLost - bestAlternative.metrics.annualFeesLost
  );

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const quickPresets = [100, 500, 1000, 2500, 5000, 10000];

  const isInitialSelection = selectedProcessorId === initialProcessorId;
  const activeSlug =
    activeProcessor.slug || `${activeProcessor.id}-fee-calculator`;
  const headingText =
    isInitialSelection && customHeading
      ? customHeading
      : activeProcessor.seoTitle ||
        `${activeProcessor.name} Fee & Reverse Gross-Up Calculator (2026 Rates)`;
  const descriptionText =
    isInitialSelection && customDescription
      ? customDescription
      : activeProcessor.seoDescription ||
        `Calculate exact ${activeProcessor.name} payment processing fees, cross-border surcharges, and reverse invoice gross-up amounts.`;

  const relatedPages = useMemo(() => {
    return pseoPages.filter((p) => p.processorId === activeProcessor.id);
  }, [activeProcessor.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar de Navigare Programmatic SEO */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">
                  FeeCalc
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  B2B FinTech Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                100% Client-Side • Zero-Latency • Cloudflare Pages Ready
              </p>
            </div>
          </Link>

          {/* Selector rapid de procesator */}
          <nav
            aria-label="Payment Processors"
            className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full"
          >
            {PROCESSORS.map((proc) => {
              const active = proc.id === selectedProcessorId;
              return (
                <button
                  key={proc.id}
                  type="button"
                  onClick={() => setSelectedProcessorId(proc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {proc.name}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Banner Top Above-The-Fold (Fără CLS) */}
        <ZeroClsAdSlot
          slotId="header-top-728x90"
          format="leaderboard"
          refreshIntervalSec={45}
        />

        {/* Breadcrumb URL pSEO + Titlu Dinamic */}
        <div className="space-y-2">
          <Link
            href={`/calculators/${activeSlug}/`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-md hover:border-emerald-500/60 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>feecalc.io/calculators/{activeSlug}/</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {headingText}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
            {descriptionText}
          </p>
        </div>

        {/* GRILA PRINCIPALĂ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLOANA STÂNGA (7 cols): Controale Calculator */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            {/* Comutator Mod: Standard vs Reverse Gross-Up */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Alege Modul de Calcul
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCalcMode("reverse_gross_up")}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    calcMode === "reverse_gross_up"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 shrink-0" />
                  <span>Reverse Gross-Up (Vreau Net Fix)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode("gross_to_net")}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    calcMode === "gross_to_net"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Standard (Am Suma Facturată)</span>
                </button>
              </div>
            </div>

            {/* Input Sumă Principală + Butoane Preset */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {calcMode === "reverse_gross_up"
                    ? "2. Suma Netă pe care vrei să o primești în bancă ($)"
                    : "2. Suma Brută trecută pe factură / checkout ($)"}
                </label>
                <span className="text-xs font-mono text-emerald-400">
                  Comision de bază: {(activeProcessor.baseRate * 100).toFixed(2)}
                  % + ${activeProcessor.fixedFee.toFixed(2)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-bold text-slate-500">
                  {activeProcessor.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3.5 text-2xl sm:text-3xl font-mono font-bold text-white focus:outline-none transition-colors"
                  placeholder="1000.00"
                />
              </div>

              {/* Preset-uri rapide */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-500 mr-1">
                  Sume frecvente:
                </span>
                {quickPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInputAmount(val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                      Number(inputAmount) === val
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Comutatoare pentru Taxe Ascunse */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                3. Condiții Tranzacție & Taxe Adiționale Ascunse
              </label>

              {/* Toggle 1: Card Internațional */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition">
                <div className="space-y-0.5 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      Clientul plătește din altă țară (Cross-Border /
                      International Card)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      +{(activeProcessor.intlFee * 100).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Aplicat când țara băncii clientului diferă de țara entității
                    tale comerciale.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isInternational}
                  onChange={(e) => setIsInternational(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0"
                />
              </label>

              {/* Toggle 2: Conversie Valutară (FX) */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition">
                <div className="space-y-0.5 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      Conversie Valutară Automată (Ex: Încasezi USD în cont de
                      EUR/RON)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      +{(activeProcessor.fxFee * 100).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Spread-ul de schimb valutar perceput peste rata interbancară
                    (evitabil cu Wise/Mercury).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={needsCurrencyConversion}
                  onChange={(e) =>
                    setNeedsCurrencyConversion(e.target.checked)
                  }
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0"
                />
              </label>

              {/* Toggle 3: Invoicing / Recurring Addon */}
              {activeProcessor.invoicingFee > 0 && (
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition">
                  <div className="space-y-0.5 pr-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">
                        Folosești Invoicing / Abonament Recurent (Billing
                        Module)
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        +{(activeProcessor.invoicingFee * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Suprataxă pentru generarea facturilor PDF găzduite sau
                      gestionarea subscripțiilor.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAddonFee}
                    onChange={(e) => setIncludeAddonFee(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0"
                  />
                </label>
              )}
            </div>

            {/* Simulator Volum Lunar */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-wider font-semibold text-slate-400">
                  4. Volum Lunar Estimat (Nr. Facturi / Plăți pe lună)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {monthlyTxCount} tranzacții / lună
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={monthlyTxCount}
                onChange={(e) => setMonthlyTxCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1 plată/lună (Freelancer)</span>
                <span>50 plăți/lună (Agenție)</span>
                <span>200 plăți/lună (SaaS)</span>
              </div>
            </div>
          </div>

          {/* COLOANA DREAPTA (5 cols): Panou Rezultate Live & Card Afiliere B2B */}
          <div className="lg:col-span-5 space-y-5">
            {/* Cardul Principal de Rezultat */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {calcMode === "reverse_gross_up"
                    ? "Sumă de Facturat (Gross-Up)"
                    : "Payout Net în Cont"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Taxă Efectivă:{" "}
                  <strong className="text-rose-400">
                    {currentMetrics.effectiveRatePercent.toFixed(2)}%
                  </strong>
                </span>
              </div>

              {/* Cifra Principală cu Buton Copy */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400 mb-1">
                    {calcMode === "reverse_gross_up"
                      ? `Trece această sumă pe factura ${activeProcessor.name}:`
                      : `Rămâi în mână după taxele ${activeProcessor.name} cu:`}
                  </p>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-400 tracking-tight">
                    $
                    {(calcMode === "reverse_gross_up"
                      ? currentMetrics.grossAmount
                      : currentMetrics.netPayout
                    ).toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      (calcMode === "reverse_gross_up"
                        ? currentMetrics.grossAmount
                        : currentMetrics.netPayout
                      ).toFixed(2),
                      "main_amount"
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {copiedField === "main_amount" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copiat!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copiază</span>
                    </>
                  )}
                </button>
              </div>

              {/* Descompunerea Comisioanelor (Fee Breakdown) */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Total Facturat Clientului (Brut):</span>
                  <span className="font-mono font-semibold text-white">
                    ${currentMetrics.grossAmount.toFixed(2)}
                  </span>
                </div>

                <div className="pl-3 border-l-2 border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>
                      • Comision de bază (
                      {(activeProcessor.baseRate * 100).toFixed(2)}% + $
                      {activeProcessor.fixedFee.toFixed(2)}):
                    </span>
                    <span className="font-mono text-rose-400">
                      -${currentMetrics.baseFeePart.toFixed(2)}
                    </span>
                  </div>
                  {isInternational && currentMetrics.intlFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>
                        • Suprataxă card internațional (+
                        {(activeProcessor.intlFee * 100).toFixed(2)}%):
                      </span>
                      <span className="font-mono text-rose-400">
                        -${currentMetrics.intlFeePart.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {needsCurrencyConversion && currentMetrics.fxFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>
                        • Pierdere conversie valutară FX (+
                        {(activeProcessor.fxFee * 100).toFixed(2)}%):
                      </span>
                      <span className="font-mono text-rose-400">
                        -${currentMetrics.fxFeePart.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {includeAddonFee && currentMetrics.addonFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>
                        • Taxă Invoicing / Billing (+
                        {(activeProcessor.invoicingFee * 100).toFixed(2)}%):
                      </span>
                      <span className="font-mono text-rose-400">
                        -${currentMetrics.addonFeePart.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                  <span>Total Comision Reținut de {activeProcessor.name}:</span>
                  <span className="font-mono font-bold text-rose-400">
                    -${currentMetrics.totalFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-800 font-semibold">
                  <span>Payout Net Garantat în Contul Tău:</span>
                  <span className="font-mono text-emerald-400 text-base">
                    ${currentMetrics.netPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Generator de Linie pentru Factură */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `Subtotal Servicii: $${currentMetrics.netPayout.toFixed(
                        2
                      )} | Taxă Procesare ${
                        activeProcessor.name
                      } (${currentMetrics.effectiveRatePercent.toFixed(
                        2
                      )}%): $${currentMetrics.totalFee.toFixed(
                        2
                      )} | Total de Plată: $${currentMetrics.grossAmount.toFixed(
                        2
                      )}`,
                      "invoice_line"
                    )
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copiedField === "invoice_line" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">
                        Textul pentru factură a fost copiat!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Copiază Textul Explicativ pentru Factura Clientului
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Impact Anual la volumul selectat */}
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-rose-200">
                      Pierdere Anuală pe Comisioane ({monthlyTxCount} plăți/lună)
                    </p>
                    <p className="text-[11px] text-rose-300/80">
                      La un rulaj lunar de $
                      {currentMetrics.monthlyGross.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-lg text-rose-400 shrink-0">
                  -$
                  {currentMetrics.annualFeesLost.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                  /an
                </span>
              </div>
            </div>

            {/* CARD NATIV DE AFILIERE B2B */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  {activeProcessor.affiliateBadge || "Recomandat B2B"}
                </span>
                <span className="text-[11px] text-slate-400">
                  Soluție B2B Verificată
                </span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>
                  Redu taxele {activeProcessor.name} cu{" "}
                  {activeProcessor.affiliateName}
                </span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeProcessor.affiliateTagline}
              </p>

              {potentialAnnualSavings > 50 && (
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-800/50 text-xs text-emerald-300 font-mono">
                  Economie potențială la volumul tău:{" "}
                  <strong>
                    +$
                    {potentialAnnualSavings.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    / an
                  </strong>
                </div>
              )}

              <a
                href={activeProcessor.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>
                  {activeProcessor.affiliateCtaText ||
                    `Deschide Cont ${activeProcessor.affiliateName}`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {activeProcessor.affiliateCommissionNote && (
                <p className="text-[11px] text-center text-slate-400">
                  {activeProcessor.affiliateCommissionNote}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MATRICEA COMPARATIVĂ ÎN TIMP REAL */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>
                  Comparație Live: {activeProcessor.name} vs. Alternative B2B
                  pentru ${Number(inputAmount || 0).toLocaleString()}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Clasament ordonat automat de la cel mai ieftin la cel mai scump
                procesator pentru setările tale curente.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Mod activ:{" "}
              {calcMode === "reverse_gross_up"
                ? "Reverse Gross-Up"
                : "Standard Net"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-3">Procesator</th>
                  <th className="py-3 px-3">Rată de Bază</th>
                  <th className="py-3 px-3">
                    Comision la ${Number(inputAmount || 0).toLocaleString()}
                  </th>
                  <th className="py-3 px-3">Taxă Efectivă</th>
                  <th className="py-3 px-3">
                    {calcMode === "reverse_gross_up"
                      ? "Trebuie Facturat"
                      : "Rămâi cu (Net)"}
                  </th>
                  <th className="py-3 px-3 text-right">
                    Cost Anual ({monthlyTxCount} tx/lună)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonMatrix.map((row, idx) => {
                  const isSelected = row.processor.id === activeProcessor.id;
                  const isCheapest = idx === 0;
                  return (
                    <tr
                      key={row.processor.id}
                      onClick={() => setSelectedProcessorId(row.processor.id)}
                      className={`transition cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="py-3.5 px-3 font-medium text-white flex items-center gap-2">
                        <span>{row.processor.name}</span>
                        {isCheapest && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Cel mai ieftin
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Activ
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">
                        {(row.processor.baseRate * 100).toFixed(2)}% + $
                        {row.processor.fixedFee.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-rose-400">
                        -${row.metrics.totalFee.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">
                        {row.metrics.effectiveRatePercent.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        $
                        {(calcMode === "reverse_gross_up"
                          ? row.metrics.grossAmount
                          : row.metrics.netPayout
                        ).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-300">
                        $
                        {row.metrics.annualFeesLost.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        /an
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Slot Publicitar In-Content cu Smart Refresh */}
        <ZeroClsAdSlot
          slotId="mid-content-728x250"
          format="rectangle"
          refreshIntervalSec={30}
        />

        {/* SECȚIUNE SEO & SCHEMA.ORG FAQ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                De ce nu poți adăuga pur și simplu{" "}
                {(activeProcessor.baseRate * 100).toFixed(1)}% la factură?
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Aceasta este cea mai frecventă eroare contabilă făcută de
              freelanceri și agenții. Dacă vrei să primești{" "}
              <strong>$1,000 net</strong> și adaugi 2.9% + $0.30 (facturând
              $1,029.30), {activeProcessor.name} va aplica procentul la noua
              sumă de $1,029.30, reținând $30.15 și lăsându-te cu doar{" "}
              <strong>$999.15</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
              Formula corectă Reverse Gross-Up:
              <br />
              Gross = (Net_Țintă + Taxă_Fixă) / (1 - Rată_Procentuală)
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Cum eviți taxa de conversie valutară (FX) de 1.5% – 3%?
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Procesatorii precum Stripe și PayPal percep o taxă suplimentară
              masivă dacă încasezi o factură în USD, dar contul tău bancar
              atașat pentru retragere (Payout) este în EUR sau RON.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Soluția B2B standard este atașarea unui cont multi-valută{" "}
              <strong>Wise Business</strong> sau <strong>Payoneer</strong> cu
              detalii bancare locale de SUA (Routing & Account Number ACH),
              eliminând complet pierderea de schimb valutar.
            </p>
          </div>
        </section>

        {/* DIRECTOR INTERN DE RUTE PROGRAMMATIC SEO (Internal Linking pt. Google) */}
        <footer className="border-t border-slate-800/80 pt-8 pb-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Calculatoare Dedicate pe Procesatori B2B
            </h3>
            <div className="flex flex-wrap gap-2">
              {PROCESSORS.map((proc) => (
                <Link
                  key={proc.id}
                  href={`/calculators/${proc.id}-fee-calculator/`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-emerald-400 transition"
                >
                  {proc.name} Fee Calculator
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Calcule Rapide {activeProcessor.name} pe Sume Frecvente
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/calculators/${p.slug}/`}
                  className="px-2.5 py-1 rounded-md bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-xs font-mono text-slate-400 hover:text-emerald-300 transition"
                >
                  {p.h1}
                </Link>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center pt-2">
            © {new Date().getFullYear()} FeeCalc B2B FinTech Hub • 100% Static
            Client-Side Processing
          </p>
        </footer>
      </main>
    </div>
  );
}

