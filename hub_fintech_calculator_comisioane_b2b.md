import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  Globe, 
  ShieldCheck, 
  TrendingDown, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  DollarSign, 
  Sparkles, 
  Layers, 
  RefreshCw,
  HelpCircle,
  ChevronRight,
  Zap,
  Building2,
  Lock
} from 'lucide-react';

// ============================================================================
// BAZA DE DATE JSON (Simulează output-ul generat de scriptul Python la pre-build)
// ============================================================================
const PROCESSORS_DATA = [
  {
    id: 'stripe-us',
    slug: 'stripe-fee-calculator',
    name: 'Stripe',
    planName: 'Standard Checkout (US/Global)',
    category: 'Payment Gateway',
    baseRate: 0.029,        // 2.9%
    fixedFee: 0.30,         // $0.30
    intlFee: 0.015,         // +1.5% pentru carduri internaționale
    fxFee: 0.01,            // +1.0% pentru conversie valutară
    invoicingFee: 0.004,    // +0.4% Stripe Invoicing
    currency: 'USD',
    symbol: '$',
    payoutSpeed: '2 zile lucrătoare',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Wise Business',
      tagline: 'Economisește până la 6x la încasările Stripe în valută străină cu conturi locale USD/EUR/GBP.',
      ctaText: 'Deschide Cont Wise Business (0$ Taxă Setup)',
      commissionNote: 'Primești primele 5.000$ transferate fără comision',
      url: '#wise-affiliate-link',
      badge: 'Recomandat pt. Exportatori'
    },
    seoTitle: 'Stripe Fee & Reverse Gross-Up Calculator (2026 Rates)',
    seoDescription: 'Calculate exact Stripe processing fees, international card surcharges, currency conversion costs, and the exact invoice gross-up amount.'
  },
  {
    id: 'paypal-com',
    slug: 'paypal-fee-calculator',
    name: 'PayPal',
    planName: 'Commercial / Checkout',
    category: 'Digital Wallet & Gateway',
    baseRate: 0.0349,       // 3.49%
    fixedFee: 0.49,         // $0.49
    intlFee: 0.015,         // +1.5% cross-border
    fxFee: 0.03,            // +3.0% FX spread
    invoicingFee: 0.0,
    currency: 'USD',
    symbol: '$',
    payoutSpeed: 'Instant / 1 zi',
    chargebackFee: 20.00,
    affiliatePartner: {
      name: 'Payoneer B2B',
      tagline: 'Evită spread-ul valutar de 4.5% de la PayPal. Încasează B2B cu doar 0.5% - 1% comision.',
      ctaText: 'Încearcă Payoneer B2B (+$50 Bonus la rulaj)',
      commissionNote: 'Aprobat pentru freelanceri și agenții din România',
      url: '#payoneer-affiliate-link',
      badge: 'Alternativă Ieftină'
    },
    seoTitle: 'PayPal Business Fee & Invoice Gross-Up Calculator',
    seoDescription: 'Stop losing 5%+ on PayPal cross-border transactions. Calculate exact PayPal Goods & Services fees and reverse invoice totals.'
  },
  {
    id: 'lemonsqueezy',
    slug: 'lemonsqueezy-fee-calculator',
    name: 'Lemon Squeezy',
    planName: 'Merchant of Record (SaaS)',
    category: 'Merchant of Record (Taxe Incluse)',
    baseRate: 0.05,         // 5.0%
    fixedFee: 0.50,         // $0.50
    intlFee: 0.015,         // +1.5% plăți în afara US
    fxFee: 0.01,            // +1.0% FX
    invoicingFee: 0.005,    // +0.5% abonamente recurente
    currency: 'USD',
    symbol: '$',
    payoutSpeed: 'Bi-lunar',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Paddle MoR',
      tagline: 'Vinzi SaaS cu volum mare? Negociază comisioane MoR custom sub 5% și automatizează TVA-ul global.',
      ctaText: 'Simulează Migrarea pe Paddle',
      commissionNote: 'Include protecție antifraudă și gestionare completă Sales Tax',
      url: '#paddle-affiliate-link',
      badge: 'Top pentru Micro-SaaS'
    },
    seoTitle: 'Lemon Squeezy Fee & SaaS Margin Calculator',
    seoDescription: 'Calculate Merchant of Record fees for Lemon Squeezy including international payouts, subscription surcharges, and net SaaS profit.'
  },
  {
    id: 'paddle',
    slug: 'paddle-fee-calculator',
    name: 'Paddle',
    planName: 'Standard MoR Checkout',
    category: 'Merchant of Record (Taxe Incluse)',
    baseRate: 0.05,         // 5.0%
    fixedFee: 0.50,         // $0.50
    intlFee: 0.0,           // Inclus în 5%
    fxFee: 0.015,           //Spread FX la conversie
    invoicingFee: 0.0,
    currency: 'USD',
    symbol: '$',
    payoutSpeed: 'Lunar / Instant prin Wise',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Mercury Bank (US LLC)',
      tagline: 'Ai un US LLC în Delaware/Wyoming? Încasează din Paddle direct în USD cu 0% pierdere de curs.',
      ctaText: 'Aplică pentru Cont B2B Mercury',
      commissionNote: '0$ taxe lunare, carduri virtuale nelimitate pentru Cloud & Ads',
      url: '#mercury-affiliate-link',
      badge: 'Zero FX Loss'
    },
    seoTitle: 'Paddle Merchant of Record Fee & Payout Calculator',
    seoDescription: 'Estimate your net SaaS revenue with Paddle after the 5% + $0.50 fee and currency conversion spreads.'
  },
  {
    id: 'wise-b2b',
    slug: 'wise-business-fee-calculator',
    name: 'Wise Business',
    planName: 'Card & Payment Links',
    category: 'Low-Cost B2B Settlement',
    baseRate: 0.01,         // ~1.0% pt carduri EEA/UK sau ACH
    fixedFee: 0.20,
    intlFee: 0.019,         // Carduri internaționale / corporate
    fxFee: 0.0043,          // ~0.43% cursul real mid-market
    invoicingFee: 0.0,
    currency: 'USD',
    symbol: '$',
    payoutSpeed: 'Instant în contul Wise',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Wise Business Multi-Currency',
      tagline: 'Cea mai mică taxă din industrie pentru facturi B2B și freelanceri. Curs valutar real Google.',
      ctaText: 'Activează Contul Wise Business Acum',
      commissionNote: 'Economisești în medie $142 la fiecare $3.000 facturați extern',
      url: '#wise-direct-link',
      badge: 'Cel Mai Ieftin Procesator'
    },
    seoTitle: 'Wise Business Fee & Exchange Rate Markup Calculator',
    seoDescription: 'See how much you save using Wise Business payment links compared to Stripe and PayPal.'
  },
  {
    id: 'gumroad',
    slug: 'gumroad-fee-calculator',
    name: 'Gumroad',
    planName: 'Creator Flat Fee (+Stripe/PayPal)',
    category: 'Digital Products & Creators',
    baseRate: 0.10,         // 10% flat Gumroad fee (+ ~2.9% procesator)
    fixedFee: 0.30,
    intlFee: 0.029,         // Procesare card adițională
    fxFee: 0.01,
    invoicingFee: 0.0,
    currency: 'USD',
    symbol: '$',
    payoutSpeed: 'Săptămânal (Vineri)',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Lemon Squeezy',
      tagline: 'Gumroad îți ia peste 13% cu tot cu procesarea cardului! Înjumătățește-ți costurile migrând în 5 minute.',
      ctaText: 'Migrează de pe Gumroad și Economisește 50%',
      commissionNote: 'Import automat de produse și clienți',
      url: '#lemonsqueezy-affiliate-link',
      badge: 'Redu Taxele de la 13% la 5%'
    },
    seoTitle: 'Gumroad Real Fee Calculator (10% + Processing)',
    seoDescription: 'Calculate the true cost of selling on Gumroad including the 10% platform cut plus credit card processing fees.'
  },
  {
    id: 'shopify-pay',
    slug: 'shopify-payments-fee-calculator',
    name: 'Shopify Payments',
    planName: 'Basic Plan Online Card Rate',
    category: 'E-Commerce Checkout',
    baseRate: 0.029,
    fixedFee: 0.30,
    intlFee: 0.01,          // +1.0% international cards
    fxFee: 0.015,           // +1.5% currency conversion
    invoicingFee: 0.02,     // +2.0% dacă folosești alt procesator (3rd party)
    currency: 'USD',
    symbol: '$',
    payoutSpeed: '1-3 zile lucrătoare',
    chargebackFee: 15.00,
    affiliatePartner: {
      name: 'Juni / Airwallex E-Com',
      tagline: 'Rulezi magazin Shopify? Primește până la 1% Cashback la bugetul de Facebook/Google Ads și 0% FX.',
      ctaText: 'Deschide Cont Airwallex E-Commerce',
      commissionNote: 'Integrare directă cu Shopify Payouts în 12 valute',
      url: '#airwallex-affiliate-link',
      badge: '1% Cashback pe Reclame'
    },
    seoTitle: 'Shopify Payments Fee & Profit Margin Calculator',
    seoDescription: 'Calculate Shopify Basic, Grow, and Advanced payment processing fees and third-party gateway penalties.'
  }
];

// ============================================================================
// MOTORUL MATEMATIC PUR (TypeScript / ES6 - Execuție 0ms în Browser)
// ============================================================================
function computeProcessorMetrics(amount, mode, processor, options) {
  const { isInternational, needsCurrencyConversion, includeAddonFee, monthlyTxCount } = options;
  
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
      annualFeesLost: 0
    };
  }

  // Compunem rata procentuală totală activă (P_total)
  const activePercentageRate = 
    processor.baseRate + 
    (isInternational ? processor.intlFee : 0) + 
    (needsCurrencyConversion ? processor.fxFee : 0) + 
    (includeAddonFee ? processor.invoicingFee : 0);

  const fixedFee = processor.fixedFee;

  let grossAmount = 0;
  let netPayout = 0;
  let totalFee = 0;

  if (mode === 'gross_to_net') {
    // Utilizatorul introduce cât facturează (Gross) -> Calculăm cu cât rămâne (Net)
    grossAmount = cleanAmount;
    totalFee = (grossAmount * activePercentageRate) + fixedFee;
    netPayout = Math.max(0, grossAmount - totalFee);
  } else {
    // REVERSE GROSS-UP: Utilizatorul introduce cât vrea să primească net în mână -> Calculăm cât trebuie să treacă pe factură
    // Formula algebrică exactă: Gross = (TargetNet + FixedFee) / (1 - TotalRate)
    netPayout = cleanAmount;
    const denominator = Math.max(0.01, 1 - activePercentageRate);
    grossAmount = (netPayout + fixedFee) / denominator;
    totalFee = grossAmount - netPayout;
  }

  // Defalcarea fiecărei componente de cost din suma brută finală
  const baseFeePart = (grossAmount * processor.baseRate) + fixedFee;
  const intlFeePart = isInternational ? grossAmount * processor.intlFee : 0;
  const fxFeePart = needsCurrencyConversion ? grossAmount * processor.fxFee : 0;
  const addonFeePart = includeAddonFee ? grossAmount * processor.invoicingFee : 0;

  const effectiveRatePercent = grossAmount > 0 ? (totalFee / grossAmount) * 100 : 0;

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
    annualFeesLost
  };
}

// ============================================================================
// COMPONENTA SLOT PUBLICITAR ANTI-CLS + SMART AD REFRESH (Viewability-based)
// ============================================================================
function ZeroClsAdSlot({ slotId, format = 'leaderboard', refreshIntervalSec = 35 }) {
  const [secondsLeft, setSecondsLeft] = useState(refreshIntervalSec);
  const [impressionCount, setImpressionCount] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
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
  }, [isVisible, refreshIntervalSec]);

  const heightClass = format === 'leaderboard' ? 'min-h-[110px] sm:min-h-[90px]' : 'min-h-[250px]';

  return (
    <div 
      className={`w-full ${heightClass} bg-slate-900/70 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden transition-colors`}
      aria-label={`Advertisement Slot ${slotId}`}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">AD SLOT: {slotId}</span>
        <span>•</span>
        <span>Zero-CLS Reserved Container</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-emerald-400 font-mono">
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
          Smart Refresh: {secondsLeft}s (Imp #{impressionCount})
        </span>
      </div>
      
      <div className="text-center max-w-lg">
        <p className="text-xs font-medium text-slate-300">
          [ Spațiu Rezervat Google AdSense / Mediavine / AdX High-RPM FinTech Banner ]
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Traficul B2B pe cuvinte cheie „Stripe / PayPal Fee Calculator” generează un RPM mediu de <strong className="text-emerald-400">$18 – $35 USD</strong>.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// APLICATIA PRINCIPALA
// ============================================================================
export default function App() {
  // Stare pentru ruta pSEO activă (simulează navigarea instantanee între cele 1.500 de pagini statice)
  const [selectedProcessorId, setSelectedProcessorId] = useState('stripe-us');
  
  // Starea calculatorului
  const [calcMode, setCalcMode] = useState('reverse_gross_up'); // 'gross_to_net' | 'reverse_gross_up'
  const [inputAmount, setInputAmount] = useState(1000);
  const [monthlyTxCount, setMonthlyTxCount] = useState(25);
  
  // Opțiuni avansate care cresc timpul petrecut pe pagină (Dwell Time > 4 min)
  const [isInternational, setIsInternational] = useState(true);
  const [needsCurrencyConversion, setNeedsCurrencyConversion] = useState(false);
  const [includeAddonFee, setIncludeAddonFee] = useState(false);

  // Stare pentru copierea în clipboard
  const [copiedField, setCopiedField] = useState(null);

  const activeProcessor = useMemo(() => {
    return PROCESSORS_DATA.find((p) => p.id === selectedProcessorId) || PROCESSORS_DATA[0];
  }, [selectedProcessorId]);

  const currentMetrics = useMemo(() => {
    return computeProcessorMetrics(inputAmount, calcMode, activeProcessor, {
      isInternational,
      needsCurrencyConversion,
      includeAddonFee,
      monthlyTxCount
    });
  }, [inputAmount, calcMode, activeProcessor, isInternational, needsCurrencyConversion, includeAddonFee, monthlyTxCount]);

  // Calcul comparativ în timp real pentru toate platformele (pentru tabelul de jos)
  const comparisonMatrix = useMemo(() => {
    return PROCESSORS_DATA.map((proc) => {
      const metrics = computeProcessorMetrics(inputAmount, calcMode, proc, {
        isInternational,
        needsCurrencyConversion,
        includeAddonFee,
        monthlyTxCount
      });
      return {
        processor: proc,
        metrics
      };
    }).sort((a, b) => a.metrics.totalFee - b.metrics.totalFee);
  }, [inputAmount, calcMode, isInternational, needsCurrencyConversion, includeAddonFee, monthlyTxCount]);

  const bestAlternative = comparisonMatrix[0];
  const potentialAnnualSavings = Math.max(0, currentMetrics.annualFeesLost - bestAlternative.metrics.annualFeesLost);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const quickPresets = [100, 500, 1000, 2500, 5000, 10000];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar de Navigare Programmatic SEO (Simulare Rute Statice Next.js) */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">FeeCalc</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  B2B FinTech Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                100% Client-Side • Zero-Latency • Cloudflare Pages Ready
              </p>
            </div>
          </div>

          {/* Selector rapid de pagină pSEO */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {PROCESSORS_DATA.map((proc) => {
              const active = proc.id === selectedProcessorId;
              return (
                <button
                  key={proc.id}
                  onClick={() => setSelectedProcessorId(proc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {proc.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Banner Top Above-The-Fold (Fără CLS) */}
        <ZeroClsAdSlot slotId="header-top-728x90" format="leaderboard" refreshIntervalSec={45} />

        {/* Breadcrumb URL pSEO + Titlu Dinamic */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-md">
            <Globe className="w-3.5 h-3.5" />
            <span>feecalc.io/calculators/{activeProcessor.slug}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {activeProcessor.seoTitle}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
            {activeProcessor.seoDescription}
          </p>
        </div>

        {/* GRILA PRINCIPALĂ: Stânga Input-uri & Setări | Dreapta Rezultate & Afiliere */}
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
                  onClick={() => setCalcMode('reverse_gross_up')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    calcMode === 'reverse_gross_up'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 shrink-0" />
                  <span>Reverse Gross-Up (Vreau Net Fix)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('gross_to_net')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    calcMode === 'gross_to_net'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Standard (Am Suma Facturată)</span>
                </button>
              </div>
            </div>

            {/* Input Sumă Principală + Butoane Preset */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {calcMode === 'reverse_gross_up'
                    ? '2. Suma Netă pe care vrei să o primești în bancă ($)'
                    : '2. Suma Brută trecută pe factură / checkout ($)'}
                </label>
                <span className="text-xs font-mono text-emerald-400">
                  Comision de bază: {(activeProcessor.baseRate * 100).toFixed(2)}% + ${activeProcessor.fixedFee.toFixed(2)}
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
                <span className="text-xs text-slate-500 mr-1">Sume frecvente:</span>
                {quickPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInputAmount(val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                      Number(inputAmount) === val
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Comutatoare pentru Taxe Ascunse (Cross-border, FX, Invoicing) */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                3. Condiții Tranzacție & Taxe Adiționale Ascunse
              </label>

              {/* Toggle 1: Card Internațional */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition">
                <div className="space-y-0.5 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      Clientul plătește din altă țară (Cross-Border / International Card)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      +{(activeProcessor.intlFee * 100).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Aplicat când țara băncii clientului diferă de țara entității tale comerciale.
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      Conversie Valutară Automată (Ex: Încasezi USD în cont de EUR/RON)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      +{(activeProcessor.fxFee * 100).toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Spread-ul de schimb valutar perceput peste rata interbancară (evitabil cu Wise/Mercury).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={needsCurrencyConversion}
                  onChange={(e) => setNeedsCurrencyConversion(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0"
                />
              </label>

              {/* Toggle 3: Invoicing / Recurring Addon */}
              {activeProcessor.invoicingFee > 0 && (
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition">
                  <div className="space-y-0.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">
                        Folosești Invoicing / Abonament Recurent (Billing Module)
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        +{(activeProcessor.invoicingFee * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Suprataxă pentru generarea facturilor PDF găzduite sau gestionarea subscripțiilor.
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

            {/* Simulator Volum Lunar (Crește retenția pe pagină) */}
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
                  {calcMode === 'reverse_gross_up' ? 'Sumă de Facturat (Gross-Up)' : 'Payout Net în Cont'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Taxă Efectivă: <strong className="text-rose-400">{currentMetrics.effectiveRatePercent.toFixed(2)}%</strong>
                </span>
              </div>

              {/* Cifra Principală cu Buton Copy */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">
                    {calcMode === 'reverse_gross_up'
                      ? `Trece această sumă pe factura ${activeProcessor.name}:`
                      : `Rămâi în mână după taxele ${activeProcessor.name} cu:`}
                  </p>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-400 tracking-tight">
                    ${(calcMode === 'reverse_gross_up' ? currentMetrics.grossAmount : currentMetrics.netPayout).toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      (calcMode === 'reverse_gross_up' ? currentMetrics.grossAmount : currentMetrics.netPayout).toFixed(2),
                      'main_amount'
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedField === 'main_amount' ? (
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
                  <span className="font-mono font-semibold text-white">${currentMetrics.grossAmount.toFixed(2)}</span>
                </div>

                <div className="pl-3 border-l-2 border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>• Comision de bază ({(activeProcessor.baseRate * 100).toFixed(2)}% + ${activeProcessor.fixedFee}):</span>
                    <span className="font-mono text-rose-400">-${currentMetrics.baseFeePart.toFixed(2)}</span>
                  </div>
                  {isInternational && currentMetrics.intlFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>• Suprataxă card internațional (+{(activeProcessor.intlFee * 100).toFixed(2)}%):</span>
                      <span className="font-mono text-rose-400">-${currentMetrics.intlFeePart.toFixed(2)}</span>
                    </div>
                  )}
                  {needsCurrencyConversion && currentMetrics.fxFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>• Pierdere conversie valutară FX (+{(activeProcessor.fxFee * 100).toFixed(2)}%):</span>
                      <span className="font-mono text-rose-400">-${currentMetrics.fxFeePart.toFixed(2)}</span>
                    </div>
                  )}
                  {includeAddonFee && currentMetrics.addonFeePart > 0 && (
                    <div className="flex justify-between">
                      <span>• Taxă Invoicing / Billing (+{(activeProcessor.invoicingFee * 100).toFixed(2)}%):</span>
                      <span className="font-mono text-rose-400">-${currentMetrics.addonFeePart.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                  <span>Total Comision Reținut de {activeProcessor.name}:</span>
                  <span className="font-mono font-bold text-rose-400">-${currentMetrics.totalFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-800 font-semibold">
                  <span>Payout Net Garantat în Contul Tău:</span>
                  <span className="font-mono text-emerald-400 text-base">${currentMetrics.netPayout.toFixed(2)}</span>
                </div>
              </div>

              {/* Generator de Linie pentru Factură (Utilitate Practică B2B) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `Subtotal Servicii: $${currentMetrics.netPayout.toFixed(2)} | Taxă Procesare ${activeProcessor.name} (${currentMetrics.effectiveRatePercent.toFixed(2)}%): $${currentMetrics.totalFee.toFixed(2)} | Total de Plată: $${currentMetrics.grossAmount.toFixed(2)}`,
                      'invoice_line'
                    )
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copiedField === 'invoice_line' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Textul pentru factură a fost copiat!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiază Textul Explicativ pentru Factura Clientului</span>
                    </>
                  )}
                </button>
              </div>

              {/* Impact Anual la volumul selectat */}
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-rose-200">
                      Pierdere Anuală pe Comisioane ({monthlyTxCount} plăți/lună)
                    </p>
                    <p className="text-[11px] text-rose-300/80">
                      La un rulaj lunar de ${currentMetrics.monthlyGross.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-lg text-rose-400">
                  -${currentMetrics.annualFeesLost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/an
                </span>
              </div>
            </div>

            {/* CARD NATIV DE AFILIERE B2B (100% Imun la AdBlocker - Comision $50-$150 CPA) */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  {activeProcessor.affiliatePartner.badge}
                </span>
                <span className="text-[11px] text-slate-400">Soluție B2B Verificată</span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Redu taxele {activeProcessor.name} cu {activeProcessor.affiliatePartner.name}</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeProcessor.affiliatePartner.tagline}
              </p>

              {potentialAnnualSavings > 50 && (
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-800/50 text-xs text-emerald-300 font-mono">
                  💡 Economie potențială la volumul tău: <strong>+${potentialAnnualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} / an</strong>
                </div>
              )}

              <a
                href={activeProcessor.affiliatePartner.url}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Acesta este butonul tău de afiliere B2B către ${activeProcessor.affiliatePartner.name}.\n\nNu poate fi blocat de uBlock Origin deoarece este o componentă React nativă pe propriul domeniu. Un singur cont B2B deschis prin linkul tău îți aduce între $50 și $150 comision!`);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>{activeProcessor.affiliatePartner.ctaText}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-center text-slate-400">
                {activeProcessor.affiliatePartner.commissionNote}
              </p>
            </div>

          </div>
        </div>

        {/* MATRICEA COMPARATIVĂ ÎN TIMP REAL (Crește retenția și ajută SEO pe cuvinte "vs") */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Comparație Live: {activeProcessor.name} vs. Alternative B2B pentru ${Number(inputAmount || 0).toLocaleString()}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Clasament ordonat automat de la cel mai ieftin la cel mai scump procesator pentru setările tale curente.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Mod activ: {calcMode === 'reverse_gross_up' ? 'Reverse Gross-Up' : 'Standard Net'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-3">Procesator</th>
                  <th className="py-3 px-3">Rată de Bază</th>
                  <th className="py-3 px-3">Comision la ${Number(inputAmount || 0).toLocaleString()}</th>
                  <th className="py-3 px-3">Taxă Efectivă</th>
                  <th className="py-3 px-3">
                    {calcMode === 'reverse_gross_up' ? 'Trebuie Facturat' : 'Rămâi cu (Net)'}
                  </th>
                  <th className="py-3 px-3 text-right">Cost Anual ({monthlyTxCount} tx/lună)</th>
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
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/15'
                          : 'hover:bg-slate-800/50'
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
                        {(row.processor.baseRate * 100).toFixed(2)}% + ${row.processor.fixedFee.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-rose-400">
                        -${row.metrics.totalFee.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">
                        {row.metrics.effectiveRatePercent.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        ${(calcMode === 'reverse_gross_up' ? row.metrics.grossAmount : row.metrics.netPayout).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-300">
                        ${row.metrics.annualFeesLost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/an
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Slot Publicitar In-Content cu Smart Refresh */}
        <ZeroClsAdSlot slotId="mid-content-728x250" format="rectangle" refreshIntervalSec={30} />

        {/* SECȚIUNE SEO & SCHEMA.ORG FAQ (Pentru Featured Snippets în Google) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>De ce nu poți adăuga pur și simplu {(activeProcessor.baseRate * 100).toFixed(1)}% la factură?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Aceasta este cea mai frecventă eroare contabilă făcută de freelanceri și agenții. Dacă vrei să primești <strong>$1,000 net</strong> și adaugi 2.9% + $0.30 (facturând $1,029.30), {activeProcessor.name} va aplica procentul de 2.9% la noua sumă de $1,029.30, reținând $30.15 și lăsându-te cu doar <strong>$999.15</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
              Formula corectă Reverse Gross-Up:<br />
              Gross = (Net_Țintă + Taxă_Fixă) / (1 - Rată_Procentuală)
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cum eviți taxa de conversie valutară (FX) de 1.5% – 3%?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Procesatorii precum Stripe și PayPal percep o taxă suplimentară masivă dacă încasezi o factură în USD, dar contul tău bancar atașat pentru retragere (Payout) este în EUR sau RON.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Soluția B2B standard este atașarea unui cont multi-valută <strong>Wise Business</strong> sau <strong>Payoneer</strong> cu detalii bancare locale de SUA (Routing & Account Number ACH), eliminând complet pierderea de schimb valutar.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}