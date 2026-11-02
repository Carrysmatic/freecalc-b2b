interface AffiliateBannerProps {
  affiliateName: string;
  affiliatePitch: string;
  affiliateUrl: string;
  isRo?: boolean;
}

export default function AffiliateBanner({
  affiliateName,
  affiliatePitch,
  affiliateUrl,
  isRo = false,
}: AffiliateBannerProps) {
  return (
    <div className="p-4 bg-slate-950 border border-emerald-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded font-semibold">
          {isRo ? "Optimizare Costuri B2B" : "Fee Optimization Tip"}
        </span>
        <h4 className="font-bold text-white mt-1">{affiliateName}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{affiliatePitch}</p>
      </div>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
      >
        {isRo ? "Vezi Soluția →" : "Compare Rates →"}
      </a>
    </div>
  );
}

