interface AdSlotProps {
  slotId: string;
  format?: "leaderboard" | "rectangle";
  locale?: "en" | "ro";
}

export default function AdSlot({
  slotId,
  format = "leaderboard",
  locale = "en",
}: AdSlotProps) {
  const heightClass =
    format === "leaderboard"
      ? "min-h-[100px] sm:min-h-[90px]"
      : "min-h-[250px]";

  const isRo = locale === "ro";

  return (
    <div
      className={`w-full max-w-3xl mx-auto ${heightClass} bg-slate-900/60 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-3 text-center`}
      aria-label={`Advertisement Slot ${slotId}`}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-1">
        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
          AD SLOT: {slotId}
        </span>
        <span>•</span>
        <span>Zero-CLS Reserved</span>
      </div>
      <p className="text-xs text-slate-400">
        {isRo
          ? "Spațiu rezervat AdSense / AdX FinTech B2B (Fără deplasare de layout / Zero-CLS)"
          : "Reserved Google AdSense / AdX High-RPM FinTech Placement (Zero-CLS Container)"}
      </p>
    </div>
  );
}

