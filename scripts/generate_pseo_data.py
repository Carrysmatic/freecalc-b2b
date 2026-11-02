import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Definim procesatorii de bază și comisioanele oficiale 2026
PROCESSORS = [
    {
        "id": "stripe",
        "slug": "stripe-fee-calculator",
        "name": "Stripe",
        "planName": "Standard Checkout (US/Global)",
        "category": "Payment Gateway",
        "baseRate": 0.029,
        "fixedFee": 0.30,
        "intlFee": 0.015,
        "fxFee": 0.01,
        "invoicingFee": 0.004,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "2 zile lucrătoare",
        "chargebackFee": 15.00,
        "affiliateName": "Wise Business",
        "affiliateTagline": "Economisește până la 6x la încasările Stripe în valută străină cu conturi locale USD/EUR/GBP.",
        "affiliateCtaText": "Deschide Cont Wise Business (0$ Taxă Setup)",
        "affiliateCommissionNote": "Încasează din Stripe în USD/EUR fără taxa de conversie valutară de 1-2%",
        "affiliateBadge": "Recomandat pt. Exportatori",
        "affiliateUrl": "https://wise.com/invite/your-affiliate-code",
        "seoTitle": "Stripe Fee & Reverse Gross-Up Calculator (2026 Rates)",
        "seoDescription": "Calculate exact Stripe processing fees, international card surcharges, currency conversion costs, and the exact invoice gross-up amount."
    },
    {
        "id": "paypal",
        "slug": "paypal-fee-calculator",
        "name": "PayPal",
        "planName": "Commercial Transactions",
        "category": "Digital Wallet & Gateway",
        "baseRate": 0.0349,
        "fixedFee": 0.49,
        "intlFee": 0.015,
        "fxFee": 0.03,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "Instant / 1 zi",
        "chargebackFee": 20.00,
        "affiliateName": "Payoneer B2B",
        "affiliateTagline": "Evită spread-ul valutar de 4.5%+ de la PayPal la clienții internaționali. Încasează B2B cu 0.5% - 1%.",
        "affiliateCtaText": "Încearcă Payoneer B2B (+$50 Bonus la rulaj)",
        "affiliateCommissionNote": "Aprobat pentru freelanceri și agenții internaționale",
        "affiliateBadge": "Alternativă Ieftină",
        "affiliateUrl": "https://payoneer.com/your-affiliate-code",
        "seoTitle": "PayPal Business Fee & Invoice Gross-Up Calculator",
        "seoDescription": "Stop losing 5%+ on PayPal cross-border transactions. Calculate exact PayPal Goods & Services fees and reverse invoice totals."
    },
    {
        "id": "lemonsqueezy",
        "slug": "lemonsqueezy-fee-calculator",
        "name": "Lemon Squeezy",
        "planName": "Merchant of Record (SaaS)",
        "category": "Merchant of Record (Taxe Incluse)",
        "baseRate": 0.05,
        "fixedFee": 0.50,
        "intlFee": 0.015,
        "fxFee": 0.01,
        "invoicingFee": 0.005,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "Bi-lunar",
        "chargebackFee": 15.00,
        "affiliateName": "Paddle MoR",
        "affiliateTagline": "Vinzi SaaS cu volum mare? Negociază comisioane MoR custom sub 5% și automatizează TVA-ul global.",
        "affiliateCtaText": "Simulează Migrarea pe Paddle",
        "affiliateCommissionNote": "Include protecție antifraudă și gestionare completă Sales Tax",
        "affiliateBadge": "Top pentru Micro-SaaS",
        "affiliateUrl": "https://paddle.com",
        "seoTitle": "Lemon Squeezy Fee & SaaS Margin Calculator",
        "seoDescription": "Calculate Merchant of Record fees for Lemon Squeezy including international payouts, subscription surcharges, and net SaaS profit."
    },
    {
        "id": "paddle",
        "slug": "paddle-fee-calculator",
        "name": "Paddle",
        "planName": "Standard MoR Checkout",
        "category": "Merchant of Record (Taxe Incluse)",
        "baseRate": 0.05,
        "fixedFee": 0.50,
        "intlFee": 0.0,
        "fxFee": 0.015,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "Lunar / Instant prin Wise",
        "chargebackFee": 15.00,
        "affiliateName": "Mercury Bank (US LLC)",
        "affiliateTagline": "Ai un US LLC în Delaware/Wyoming? Încasează din Paddle direct în USD cu 0% pierdere de curs.",
        "affiliateCtaText": "Aplică pentru Cont B2B Mercury",
        "affiliateCommissionNote": "0$ taxe lunare, carduri virtuale nelimitate pentru Cloud & Ads",
        "affiliateBadge": "Zero FX Loss",
        "affiliateUrl": "https://mercury.com",
        "seoTitle": "Paddle Merchant of Record Fee & Payout Calculator",
        "seoDescription": "Estimate your net SaaS revenue with Paddle after the 5% + $0.50 fee and currency conversion spreads."
    },
    {
        "id": "wise-business",
        "slug": "wise-business-fee-calculator",
        "name": "Wise Business",
        "planName": "Payment Links & Card",
        "category": "Low-Cost B2B Settlement",
        "baseRate": 0.01,
        "fixedFee": 0.20,
        "intlFee": 0.019,
        "fxFee": 0.0043,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "Instant în contul Wise",
        "chargebackFee": 15.00,
        "affiliateName": "Wise Business Multi-Currency",
        "affiliateTagline": "Cea mai mică taxă din industrie pentru facturi B2B și freelanceri. Curs valutar real mid-market.",
        "affiliateCtaText": "Activează Contul Wise Business Acum",
        "affiliateCommissionNote": "Economisești în medie $142 la fiecare $3.000 facturați extern",
        "affiliateBadge": "Cel Mai Ieftin Procesator",
        "affiliateUrl": "https://wise.com/invite/your-affiliate-code",
        "seoTitle": "Wise Business Fee & Exchange Rate Markup Calculator",
        "seoDescription": "See how much you save using Wise Business payment links compared to Stripe and PayPal."
    },
    {
        "id": "gumroad",
        "slug": "gumroad-fee-calculator",
        "name": "Gumroad",
        "planName": "Creator Flat Rate (+Card)",
        "category": "Digital Products & Creators",
        "baseRate": 0.10,
        "fixedFee": 0.30,
        "intlFee": 0.029,
        "fxFee": 0.01,
        "invoicingFee": 0.0,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "Săptămânal (Vineri)",
        "chargebackFee": 15.00,
        "affiliateName": "Lemon Squeezy",
        "affiliateTagline": "Gumroad îți ia peste 13% cu tot cu procesarea cardului! Înjumătățește-ți costurile migrând în 5 minute.",
        "affiliateCtaText": "Migrează de pe Gumroad și Economisește 50%",
        "affiliateCommissionNote": "Import automat de produse și clienți",
        "affiliateBadge": "Redu Taxele de la 13% la 5%",
        "affiliateUrl": "https://lemonsqueezy.com",
        "seoTitle": "Gumroad Real Fee Calculator (10% + Processing)",
        "seoDescription": "Calculate the true cost of selling on Gumroad including the 10% platform cut plus credit card processing fees."
    },
    {
        "id": "shopify-payments",
        "slug": "shopify-payments-fee-calculator",
        "name": "Shopify Payments",
        "planName": "Basic Plan Online Card Rate",
        "category": "E-Commerce Checkout",
        "baseRate": 0.029,
        "fixedFee": 0.30,
        "intlFee": 0.01,
        "fxFee": 0.015,
        "invoicingFee": 0.02,
        "currency": "USD",
        "symbol": "$",
        "payoutSpeed": "1-3 zile lucrătoare",
        "chargebackFee": 15.00,
        "affiliateName": "Airwallex E-Commerce",
        "affiliateTagline": "Rulezi magazin Shopify? Primește până la 1% Cashback la bugetul de Facebook/Google Ads și 0% FX.",
        "affiliateCtaText": "Deschide Cont Airwallex E-Commerce",
        "affiliateCommissionNote": "Integrare directă cu Shopify Payouts în 12 valute",
        "affiliateBadge": "1% Cashback pe Reclame",
        "affiliateUrl": "https://airwallex.com",
        "seoTitle": "Shopify Payments Fee & Profit Margin Calculator",
        "seoDescription": "Calculate Shopify Basic, Grow, and Advanced payment processing fees and third-party gateway penalties."
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
