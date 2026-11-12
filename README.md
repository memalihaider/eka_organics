# Eka Organics — Storefront (Next.js)

Luxury D2C storefront for Eka Organics: Ayurvedic, organic care for pregnancy, postpartum and babies.
Built with **Next.js 16 (App Router) + React 19 + TypeScript**. It has no CSS framework. The design system lives in `src/app/globals.css`.

## Run
```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```
Set `NEXT_PUBLIC_SITE_URL` (for example `https://ekaorganics.in`) in production. It is used for SEO metadata, the sitemap and robots.txt.

## Structure
```
src/
  app/
    layout.tsx                 Root: fonts (next/font), metadata, StoreProvider, modals, toast
    (store)/layout.tsx         Announcement bar, header, cart drawer, footer, WhatsApp button, welcome popup
    (store)/page.tsx           Home
    (store)/shop/              /shop?stage=pregnancy|postpartum|baby|sets&sort=best|low|high
    (store)/products/[id]/     Product page (statically generated) + Gallery + BuyBox (client)
    (store)/story, faq, order-confirmed
    checkout/                  Distraction-free checkout (own minimal layout)
    api/orders/route.ts        Order API: validates and re-prices the cart on the server
    sitemap.ts, robots.ts, not-found.tsx
  components/
    ProductArt.tsx             SVG packaging art (swap for product photos)
    ProductCard.tsx, Sections.tsx, Icons.tsx
    layout/                    Header, Footer, NewsletterForm
    store/                     StoreProvider (cart/coupon/drawers/modals), CartDrawer, Overlays (quiz, quick view, popup), Buttons
  lib/
    data.ts                    ← EDIT HERE: products, prices, coupons, FAQs, contact details, trust claims
    pricing.ts                 Pricing logic shared by the cart UI and the order API
    pincode.ts                 PIN code → state / delivery estimate
    format.ts
public/img/                    Logo files extracted from the brand artwork
_prototype/                    Original static HTML version (reference only; safe to delete)
```

## Brand direction
| | |
|---|---|
| Voice | Calm, confident, warm and knowledgeable. Never fear-based, never "quick fix" |
| Story | Traditional inspiration, modern formulation, transparent ingredients |
| Hero product | **Nabhi Ritual Oil**: designed for women 40+, low-fragrance, no camphor, in a 30 ml amber glass dropper with copper accents |
| Pricing | Products sell at MRP. No strike-through prices, "% off" tags or "save" language. The newsletter welcome gift (code `WELCOME`) is complimentary shipping |
| Proof points | Controlled by `CLAIMS` in `src/lib/data.ts`. A claim only appears on the site when its flag is `true` |

**Palette:** the logo browns (`#3D2F26` espresso, `#48372D` cocoa, `#78665A` taupe) plus deep saffron `#A8641F` (`#D9A25F` on dark backgrounds), sage `#7F8C6F` / `#DCDDCC`, terracotta `#9A5940`, copper `#B07A4F`, warm ivory `#F5EFE7` and cream `#FBF8F3`.
**Type:** Cormorant Garamond for headlines and Jost for body text, self-hosted through `next/font`.

### Claims guardrail (cosmetic language only)
Under CDSCO rules, cosmetics may only claim to cleanse, beautify or alter appearance. **Never** use: cure, treat, heal, balance hormones, regulate periods, boost metabolism, burn fat, detox, relieve acidity, bloating or improve sleep. The checker also blocks itch, rash, stretch marks, hair fall and weight loss.
**Use instead:** nourish, soften, condition, soothe, calm the senses, support a ritual, care for skin.

`npm run check:claims` scans `src/` for this wording. It also runs automatically before every `npm run build`, so a build fails if banned wording is found. Add new terms to `BANNED` in `scripts/check-claims.mjs`.

### Nabhi Ritual Oil formula
The formula comes from the brand ingredient sheet: sesame, sweet almond, fractionated coconut (caprylic/capric triglyceride), castor, turmeric CO₂, ashwagandha, shatavari, licorice, lavender and frankincense (*Boswellia serrata*), vitamin E and rosemary CO₂.
- The product page lists every ingredient with its INCI name and its role. Percentages are not shown.
- The copy says **"no added camphor"**, not "no camphor", because lavender and rosemary can contain natural traces.

### Verified claims (`CLAIMS` in data.ts)
| Flag | Default | Turn on only when you hold |
|---|---|---|
| `gmp` | `true` | The manufacturer's GMP certificate. **Verify before launch** |
| `dermatologistTested` | `true` | A dermatologist test report and patch-test protocol. **Verify before launch** |
| `crueltyFree` | `false` | Certification such as PETA or Leaping Bunny |
| `organicCertified` | `false` | An organic certificate (NPOP or COSMOS). Until then, ingredient lists say "From organic farming" |

## Conversion & SEO features
- Progress meter for complimentary shipping (₹999) and two ritual miniatures (₹1,499), plus cart upsells and "pairs with" suggestions
- Welcome popup and newsletter that offer the Ritual Guide and complimentary first shipping (`WELCOME`). The code field stays hidden behind "Have a gift or welcome code?"
- A "Find your ritual" quiz with a Women 40+ path, and product-level FAQs with FAQ structured data for Google
- PIN-code delivery estimate with COD eligibility, and city/state autofill at checkout
- UPI-first, distraction-free checkout with inline validation, plus server-side validation and re-pricing
- Sticky add-to-cart bar, quick view, search, and a "Find your ritual" quiz that adds a whole routine to the bag in one click
- Statically generated product pages, per-page metadata, Product and FAQ JSON-LD, sitemap.xml, robots.txt

## Before launch: required
1. **Payments and orders are simulated.** Follow the steps in `src/app/api/orders/route.ts`: save orders to a database, create a Razorpay or Cashfree order for prepaid payments, and confirm payment with a webhook. Alternatively, move the catalogue to Shopify and run this as a headless storefront.
2. **The PIN-code check is an estimate.** Replace `checkPin()` with your courier's serviceability API (Shiprocket or Delhivery).
3. **Replace the `// VERIFY` placeholders** in `src/lib/data.ts`:
   - WhatsApp number and email
   - Certification and testing claims. Only show what you can document.
   - Testimonials. These are placeholders and must be replaced with genuine reviews or removed. Star ratings only appear once `reviews > 0`.
4. **Product photography.** Replace `ProductArt` with `next/image` photos.
5. Add Privacy, Terms, Shipping and Refund pages, which payment gateways require.
6. Connect the newsletter and popup forms to Klaviyo or Mailchimp, and add GA4 and the Meta Pixel.
