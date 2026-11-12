/* =========================================================================
   EKA ORGANICS — STORE DATA
   Edit this file to change products, prices, contact details and claims.
   -------------------------------------------------------------------------
   ⚠ BEFORE LAUNCH: every item marked  // VERIFY  is placeholder content.
   Replace with your real certifications, test reports, contact numbers and
   genuine customer reviews (displaying invented reviews or uncertified
   claims is not permitted under India's Consumer Protection Act / ASCI code).
   ========================================================================= */

window.EKA_CONFIG = {
  whatsapp: "919999999999",            // VERIFY — country code + number, no "+"
  email: "care@ekaorganics.in",        // VERIFY
  freeShippingAt: 999,
  giftAt: 1499,                         // free miniature unlocks here
  shippingFee: 79,
  codFee: 49,
  coupons: {
    EKAFIRST10: { type: "pct", value: 10, label: "10% off your first order" },
    MAMA200:    { type: "flat", value: 200, min: 1999, label: "₹200 off above ₹1,999" },
  },
  // Trust claims shown across the site — VERIFY each against real documents
  trust: [
    { icon: "leaf",   title: "Certified Organic Actives",   text: "Cold-pressed, unrefined botanicals" },          // VERIFY certifier
    { icon: "shield", title: "Pregnancy-Safe",              text: "Formulated with OB-GYN guidance" },             // VERIFY
    { icon: "drop",   title: "Dermatologically Tested",     text: "On sensitive & baby skin" },                    // VERIFY test report
    { icon: "heart",  title: "100% Vegetarian · Cruelty-Free", text: "Never tested on animals" },
  ],
};

window.EKA_STAGES = {
  pregnancy:  { name: "Pregnancy",         line: "For the nine-month bloom",          tone: "#E7DACB" },
  postpartum: { name: "Postpartum",        line: "The sacred forty days — Sutika",    tone: "#D9C8B8" },
  baby:       { name: "Baby & Little Ones", line: "Malish rituals for tender skin",   tone: "#EFE6DB" },
  sets:       { name: "Gift Sets",         line: "Curated rituals, beautifully boxed", tone: "#CDBBAA" },
};

window.EKA_PRODUCTS = [
  {
    id: "bloom-belly-oil",
    name: "Bloom Belly Oil",
    sub: "Stretch-mark care with Kokum, Rosehip & Calendula",
    stage: "pregnancy", tags: ["bestseller"],
    art: { type: "dropper", glass: "#8B5A2E", cap: "#3D2F26", tone: "#E7DACB", short: "Bloom", kind: "Belly Oil" },
    variants: [ { size: "100 ml", price: 1295, mrp: 1495 }, { size: "200 ml", price: 2195, mrp: 2590 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Stretch marks", "Itchy, tight skin", "Elasticity"],
    benefits: [
      "Supports skin elasticity as your belly grows",
      "Calms the itch and tightness of stretching skin",
      "Deeply nourishes without a greasy finish",
      "Fragrance-free — gentle on heightened pregnancy senses",
    ],
    hero: [
      { name: "Kokum Butter", origin: "Konkan coast", note: "Rich in stearic acid to soften and support skin barrier." },
      { name: "Rosehip Seed Oil", origin: "Cold-pressed", note: "Naturally rich in essential fatty acids for supple skin." },
      { name: "Calendula", origin: "Sun-infused", note: "Soothes itchy, sensitised skin." },
      { name: "Vitamin E", origin: "Plant-derived", note: "Antioxidant that protects the oil blend." },
    ],
    ritual: "From your second trimester, warm a few drops between your palms. Massage over belly, hips, thighs and breasts in slow clockwise circles, morning and night. Continue for 3 months postpartum.",
    inci: "Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Garcinia Indica (Kokum) Seed Butter*, Rosa Canina (Rosehip) Seed Oil*, Calendula Officinalis Flower Extract*, Simmondsia Chinensis (Jojoba) Seed Oil*, Tocopherol. *Certified organic",
    safety: "Free from retinoids, salicylates, essential oils, mineral oil, parabens, phthalates and synthetic fragrance. Patch test before use. Consult your doctor if you have any concerns.",
  },
  {
    id: "velvet-belly-butter",
    name: "Velvet Belly Butter",
    sub: "Overnight balm of Kokum, Shea & Cocoa",
    stage: "pregnancy", tags: [],
    art: { type: "jar", glass: "#EADFD2", cap: "#48372D", tone: "#DCCBBA", short: "Velvet", kind: "Belly Butter" },
    variants: [ { size: "100 g", price: 1145, mrp: 1295 } ],
    rating: 4.7, reviews: 0,
    concerns: ["Dry, tight skin", "Stretch marks"],
    benefits: ["Melts into a velvet, non-sticky finish", "Intensive overnight nourishment", "Pairs with Bloom Belly Oil as a two-step ritual"],
    hero: [
      { name: "Kokum Butter", origin: "Konkan coast", note: "Softens and conditions." },
      { name: "Shea Butter", origin: "Fair-trade", note: "Locks in moisture." },
      { name: "Cocoa Butter", origin: "Kerala", note: "Comforting, rich emollient." },
    ],
    ritual: "Apply after Bloom Belly Oil at night, while skin is still warm, to seal in nourishment.",
    inci: "Garcinia Indica (Kokum) Seed Butter*, Butyrospermum Parkii (Shea) Butter*, Theobroma Cacao (Cocoa) Seed Butter*, Cocos Nucifera (Coconut) Oil*, Tocopherol. *Certified organic",
    safety: "Fragrance-free. Free from parabens, phthalates and mineral oil. Patch test before use.",
  },
  {
    id: "sutika-postpartum-oil",
    name: "Sutika Postpartum Oil",
    sub: "Traditional Ayurvedic massage for the forty days",
    stage: "postpartum", tags: ["bestseller"],
    art: { type: "pump", glass: "#6E4A2C", cap: "#C9B39B", tone: "#D9C8B8", short: "Sutika", kind: "Massage Oil" },
    variants: [ { size: "200 ml", price: 1195, mrp: 1395 }, { size: "500 ml", price: 2495, mrp: 2995 } ],
    rating: 4.9, reviews: 0,
    concerns: ["Body aches", "Recovery", "Rest & warmth"],
    benefits: ["Warming massage oil for the 40-day Sutika period", "Comforts tired muscles and back", "Inspired by classical Sutika Paricharya"],
    hero: [
      { name: "Bala", origin: "Classical herb", note: "Revered in Ayurveda for strength and restoration." },
      { name: "Dashamoola", origin: "Ten-root blend", note: "Traditionally used for warmth and comfort." },
      { name: "Ashwagandha", origin: "Madhya Pradesh", note: "Restorative adaptogen." },
      { name: "Cold-pressed Sesame", origin: "Wood-pressed", note: "The classical base for Abhyanga." },
    ],
    ritual: "Warm the oil gently. Massage the whole body in long strokes before a warm bath, ideally daily for the first 40 days after birth (or once your doctor approves, after a C-section).",
    inci: "Sesamum Indicum (Sesame) Seed Oil*, Sida Cordifolia (Bala) Root Extract*, Dashamoola Extract*, Withania Somnifera (Ashwagandha) Root Extract*, Tocopherol. *Certified organic",
    safety: "Avoid application on stitches or open wounds. Patch test before use.",
  },
  {
    id: "nurture-nursing-balm",
    name: "Nurture Nursing Balm",
    sub: "Lanolin-free, baby-safe care for nursing mothers",
    stage: "postpartum", tags: ["new"],
    art: { type: "tin", glass: "#C9B39B", cap: "#C9B39B", tone: "#E9DED2", short: "Nurture", kind: "Nursing Balm" },
    variants: [ { size: "30 g", price: 645, mrp: 745 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Sore, cracked skin", "Nursing"],
    benefits: ["Food-grade ingredients — no need to wipe off before feeding", "Soothes dry, sore skin", "Lanolin-free and fragrance-free"],
    hero: [
      { name: "Virgin Coconut Oil", origin: "Kerala", note: "Gentle and soothing." },
      { name: "Calendula", origin: "Sun-infused", note: "Comforts tender skin." },
      { name: "Kokum Butter", origin: "Konkan", note: "Protective, non-greasy." },
    ],
    ritual: "Apply a small amount after each feed. Food-grade formula.",
    inci: "Cocos Nucifera (Coconut) Oil*, Garcinia Indica (Kokum) Seed Butter*, Calendula Officinalis Flower Extract*, Cera Alba (Beeswax)*. *Certified organic",
    safety: "Food-grade ingredients. Consult a lactation specialist for persistent pain.",
  },
  {
    id: "mama-hair-elixir",
    name: "Mama Hair Elixir",
    sub: "Bhringraj & Amla for postpartum hair fall",
    stage: "postpartum", tags: [],
    art: { type: "dropper", glass: "#5E3F27", cap: "#C9B39B", tone: "#D2C0AE", short: "Mama", kind: "Hair Elixir" },
    variants: [ { size: "100 ml", price: 895, mrp: 995 } ],
    rating: 4.6, reviews: 0,
    concerns: ["Postpartum hair fall", "Dry scalp"],
    benefits: ["Nourishes the scalp during postpartum shedding", "Strengthens lengths with a classical herb infusion", "Light, washes out easily"],
    hero: [
      { name: "Bhringraj", origin: "Classical herb", note: "The 'king of hair' in Ayurveda." },
      { name: "Amla", origin: "Pratapgarh", note: "Vitamin-C rich fruit for hair." },
      { name: "Methi", origin: "Rajasthan", note: "Conditions and softens." },
    ],
    ritual: "Massage into scalp 1 hour before washing, 2–3 times a week.",
    inci: "Sesamum Indicum Seed Oil*, Eclipta Alba (Bhringraj) Extract*, Emblica Officinalis (Amla) Fruit Extract*, Trigonella Foenum-Graecum (Methi) Seed Extract*, Tocopherol. *Certified organic",
    safety: "Patch test before use.",
  },
  {
    id: "malish-baby-oil",
    name: "Malish Baby Massage Oil",
    sub: "Cold-pressed, fragrance-free for daily malish",
    stage: "baby", tags: ["bestseller"],
    art: { type: "bottle", glass: "#EFE6DB", cap: "#78665A", tone: "#EFE6DB", short: "Malish", kind: "Baby Oil" },
    variants: [ { size: "100 ml", price: 695, mrp: 795 }, { size: "200 ml", price: 1095, mrp: 1295 } ],
    rating: 4.9, reviews: 0,
    concerns: ["Daily massage", "Dry skin", "Bonding"],
    benefits: ["Light, quickly absorbed for tiny limbs", "Fragrance-free and essential-oil-free", "Inspired by the traditional Indian malish ritual"],
    hero: [
      { name: "Cold-pressed Coconut", origin: "Kerala", note: "Light and gentle." },
      { name: "Sweet Almond", origin: "Cold-pressed", note: "Softens delicate skin." },
      { name: "Sesame", origin: "Wood-pressed", note: "Classical warming malish base." },
    ],
    ritual: "Warm a few drops in your palms and massage your baby gently before bath time, using light strokes from the centre outwards.",
    inci: "Cocos Nucifera (Coconut) Oil*, Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Sesamum Indicum (Sesame) Seed Oil*, Tocopherol. *Certified organic",
    safety: "Suitable from birth. Patch test on a small area. Avoid eyes, nostrils and the umbilical stump until healed.",
  },
  {
    id: "soothe-baby-balm",
    name: "Soothe Baby Balm",
    sub: "Calendula comfort for nappy areas & dry patches",
    stage: "baby", tags: [],
    art: { type: "jar", glass: "#F3ECE3", cap: "#C9B39B", tone: "#E6D9CB", short: "Soothe", kind: "Baby Balm" },
    variants: [ { size: "50 g", price: 595, mrp: 695 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Nappy area", "Dry patches"],
    benefits: ["Forms a gentle protective layer", "Calms redness and dryness", "Fragrance-free"],
    hero: [
      { name: "Calendula", origin: "Sun-infused", note: "Classic soothing botanical." },
      { name: "Shea Butter", origin: "Fair-trade", note: "Protects and nourishes." },
    ],
    ritual: "Apply a thin layer at every nappy change or on dry patches.",
    inci: "Butyrospermum Parkii (Shea) Butter*, Cocos Nucifera Oil*, Calendula Officinalis Flower Extract*, Cera Alba*. *Certified organic",
    safety: "Suitable from birth. For external use only.",
  },
  {
    id: "baby-ubtan",
    name: "Baby Ubtan Bath Powder",
    sub: "Soap-free cleanse of besan, oats & almond",
    stage: "baby", tags: ["new"],
    art: { type: "tube", glass: "#E2D3C3", cap: "#48372D", tone: "#E9DCCD", short: "Ubtan", kind: "Bath Powder" },
    variants: [ { size: "100 g", price: 545, mrp: 645 } ],
    rating: 4.7, reviews: 0,
    concerns: ["Gentle cleansing", "Soap-free"],
    benefits: ["Grandmother's soap-free ubtan, made gentle", "Cleanses without stripping natural oils", "No sulphates, no foam agents"],
    hero: [
      { name: "Besan", origin: "Stone-ground", note: "Traditional gentle cleanser." },
      { name: "Colloidal Oats", origin: "Fine-milled", note: "Comforting for dry skin." },
      { name: "Almond", origin: "Stone-ground", note: "Soft polish." },
    ],
    ritual: "From 6 months. Mix a spoonful with milk or water into a paste, smooth over skin after malish and rinse.",
    inci: "Cicer Arietinum (Chickpea) Flour*, Avena Sativa (Oat) Kernel Flour*, Prunus Amygdalus Dulcis (Almond) Meal*. *Certified organic",
    safety: "For babies 6 months+. Patch test before use.",
  },
  {
    id: "nine-month-ritual",
    name: "The Nine-Month Ritual",
    sub: "Bloom Belly Oil + Velvet Belly Butter + Mama Hair Elixir",
    stage: "sets", tags: ["bestseller", "set"],
    art: { type: "box", glass: "#3D2F26", cap: "#C9B39B", tone: "#CDBBAA", short: "Nine-Month", kind: "Ritual Set" },
    variants: [ { size: "Set of 3", price: 2795, mrp: 3335 } ],
    rating: 4.9, reviews: 0,
    includes: ["bloom-belly-oil", "velvet-belly-butter", "mama-hair-elixir"],
    concerns: ["Gifting", "Complete pregnancy care"],
    benefits: ["The complete belly-care ritual for all three trimesters", "Hand-finished keepsake box with a ritual card", "Save 16% versus buying separately"],
    hero: [],
    ritual: "Morning: Bloom Belly Oil. Night: Oil, then seal with Velvet Belly Butter. Twice a week: Mama Hair Elixir.",
    inci: "See individual products.",
    safety: "See individual products.",
  },
  {
    id: "first-malish-kit",
    name: "Baby's First Malish Kit",
    sub: "Malish Oil + Soothe Balm + Ubtan Bath Powder",
    stage: "sets", tags: ["set"],
    art: { type: "box", glass: "#EFE6DB", cap: "#78665A", tone: "#E7DACB", short: "First Malish", kind: "Baby Set" },
    variants: [ { size: "Set of 3", price: 1595, mrp: 1835 } ],
    rating: 4.9, reviews: 0,
    includes: ["malish-baby-oil", "soothe-baby-balm", "baby-ubtan"],
    concerns: ["Gifting", "New baby"],
    benefits: ["Everything for your baby's daily malish & bath ritual", "The most-loved baby shower gift", "Save 13% versus buying separately"],
    hero: [],
    ritual: "Massage with Malish Oil, cleanse with Ubtan (6m+), finish with Soothe Balm at nappy changes.",
    inci: "See individual products.",
    safety: "See individual products.",
  },
  {
    id: "welcome-home-hamper",
    name: "Welcome Home Hamper",
    sub: "For mother & baby — the first forty days",
    stage: "sets", tags: ["set", "new"],
    art: { type: "box", glass: "#78665A", cap: "#EADFD2", tone: "#D9C8B8", short: "Welcome Home", kind: "Hamper" },
    variants: [ { size: "Set of 4", price: 3295, mrp: 3730 } ],
    rating: 5.0, reviews: 0,
    includes: ["sutika-postpartum-oil", "nurture-nursing-balm", "malish-baby-oil", "soothe-baby-balm"],
    concerns: ["Gifting", "Postpartum"],
    benefits: ["A thoughtful gift for a new mother and her baby", "Includes a handwritten note on request", "Save 12% versus buying separately"],
    hero: [],
    ritual: "Mother: Sutika Oil daily and Nurture Balm after feeds. Baby: Malish Oil before bath, Soothe Balm at changes.",
    inci: "See individual products.",
    safety: "See individual products.",
  },
];

/* Testimonials — VERIFY: placeholders. Replace with real, verifiable customer
   reviews (with consent) before going live, or remove this section. */
window.EKA_REVIEWS = [
  { name: "Customer name", city: "City", product: "Bloom Belly Oil", text: "Replace this with a genuine customer review. Real words from real mothers convert far better than polished copy.", stars: 5 },
  { name: "Customer name", city: "City", product: "Malish Baby Massage Oil", text: "Replace this with a genuine customer review — ideally one that mentions texture, scent and how their baby took to the malish.", stars: 5 },
  { name: "Customer name", city: "City", product: "Welcome Home Hamper", text: "Replace this with a genuine review from someone who gifted the hamper — gifting stories drive set sales.", stars: 5 },
];

window.EKA_FAQ = [
  ["Are Eka products safe to use during pregnancy?", "Our pregnancy range is formulated without retinoids, salicylates, essential oils and synthetic fragrance. Every body is different, so we always recommend a patch test and a quick word with your doctor."],
  ["When should I start using Bloom Belly Oil?", "Most mothers begin in the second trimester, when the belly starts to grow quickly, and continue for about three months after birth. Using it every day matters more than how much you apply."],
  ["Can the Malish Oil be used on newborns?", "Yes — it is fragrance-free and suitable from birth. Avoid the umbilical stump until it heals, and patch test on a small area first."],
  ["How long does delivery take?", "Metro cities: 1–3 working days. Rest of India: 3–6 working days. Enter your PIN code on any product page for an estimate."],
  ["Is Cash on Delivery available?", "Yes, on most PIN codes across India, for a small handling fee of ₹49."],
  ["What is your return policy?", "Unopened products can be returned within 7 days of delivery. If anything arrives damaged, WhatsApp us a photo within 48 hours and we'll replace it."],
];
