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
    const totalFee = amount * totalPercentageRate + processor.fixedFee;
    const net = Math.max(0, amount - totalFee);
    const effectiveRatePct = (totalFee / amount) * 100;
    return { gross: amount, totalFee, net, effectiveRatePct };
  } else {
    // Reverse Gross-Up: Gross = (TargetNet + FixedFee) / (1 - TotalRate)
    const gross = (amount + processor.fixedFee) / (1 - totalPercentageRate);
    const totalFee = gross - amount;
    const effectiveRatePct = (totalFee / gross) * 100;
    return { gross, totalFee, net: amount, effectiveRatePct };
  }
}

