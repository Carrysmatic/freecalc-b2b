import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FeeCalc B2B — Global Payment Fee & Reverse Gross-Up Calculator (US, CA, EU, RO)",
  description:
    "Calculate exact payment processing fees, non-EEA card surcharges, FX spreads, and reverse invoice gross-up amounts for Stripe, PayPal, Mollie, Klarna, Moneris, Netopia, and eMAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <nav className="border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-white tracking-tight">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-xs font-mono">B2B</span>
              <span>FeeCalc Hub</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition"
              >
                Global Hub (US / CA / EU)
              </Link>
              <Link
                href="/ro/"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 transition"
              >
                România Hub (RON)
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
