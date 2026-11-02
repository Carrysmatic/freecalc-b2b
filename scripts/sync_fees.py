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
        "intlCardRate": 0.0175,  # UK / Non-EEA cards cost 3.25% total
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
        "fixedFee": 0.60,  # ~0.12 EUR in RON
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
        "baseRate": 0.14,  # 14% comision mediu categorie
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


if __name__ == "__main__":
    generate_pseo_routes()

