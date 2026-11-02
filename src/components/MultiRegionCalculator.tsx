"use client";

import { useState, useMemo } from "react";
import processorsData from "@/data/processors.json";
import { Processor, computeFees } from "@/lib/feeMath";
import AffiliateBanner from "@/components/AffiliateBanner";

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
      {/* Selector Regiune (US, Canada, EU, Romania) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["ALL", "US", "CA", "EU", "RO"] as const).map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => {
              setRegionFilter(reg);
              const firstInReg = PROCESSORS.find((p) => reg === "ALL" || p.region === reg);
              if (firstInReg) setSelectedId(firstInReg.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
              regionFilter === reg
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {reg === "ALL" ? "Global (All)" : reg === "RO" ? "România (RON)" : reg}
          </button>
        ))}
      </div>

      {/* Comutator Mod: Standard vs Reverse Gross-Up */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setMode("gross_to_net")}
          className={`py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
            mode === "gross_to_net"
              ? "bg-emerald-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {isRo ? "Din Brut în Net (Cât rămâne)" : "Gross to Net (Payout)"}
        </button>
        <button
          type="button"
          onClick={() => setMode("net_to_gross")}
          className={`py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
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
      <AffiliateBanner
        affiliateName={activeProcessor.affiliateName}
        affiliatePitch={activeProcessor.affiliatePitch}
        affiliateUrl={activeProcessor.affiliateUrl}
        isRo={isRo}
      />
    </div>
  );
}

