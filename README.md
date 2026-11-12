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

## Brand palette (sampled from the logo)
`#3D2F26` espresso · `#48372D` cocoa · `#78665A` taupe · `#C9B39B` gold · `#EADFD2` champagne · `#F5EFE7` ivory · `#FBF8F3` cream
Type: Cormorant Garamond (display) and Jost (UI), self-hosted through `next/font`.

## Conversion & SEO features
- Free-shipping (₹999) and free-gift (₹1,499) progress meter, cart upsells, "pairs with" suggestions, gift sets that show the saving
- Coupons (`EKAFIRST10`, `MAMA200`), welcome popup that captures emails for 10% off, footer newsletter signup
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
