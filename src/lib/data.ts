/* =========================================================================
   EKA ORGANICS — STORE DATA
   Edit this file to change products, prices, contact details and claims.
   ⚠ BEFORE LAUNCH: every item marked  // VERIFY  is placeholder content.
   Replace with real certifications, contact numbers and genuine reviews
   (invented reviews / unverified claims breach the Consumer Protection Act
   and ASCI code).
   ========================================================================= */

export type StageKey = "midlife" | "pregnancy" | "postpartum" | "baby" | "sets";
export type ArtType = "dropper" | "pump" | "bottle" | "jar" | "tin" | "tube" | "box";

export interface Variant { size: string; price: number; mrp: number }
export interface Botanical { name: string; origin: string; note: string }
export interface Product {
  id: string;
  name: string;
  sub: string;
  stage: StageKey;
  tags: string[];
  art: { type: ArtType; glass: string; cap: string; tone: string; short: string; kind: string; size?: string; collar?: string };
  variants: Variant[];
  rating: number;
  reviews: number;
  includes?: string[];
  concerns: string[];
  benefits: string[];
  /** Detailed benefit cards (title + line) — used by the featured product */
  highlights?: { title: string; text: string }[];
  /** Who the product is designed for */
  forWhom?: string;
  /** Packaging description shown on the product page */
  packaging?: string;
  /** Product-specific FAQ */
  faq?: [string, string][];
  /** Full formula disclosure: ingredient, INCI name and its role (no percentages) */
  ingredients?: { name: string; inci: string; role: string }[];
  hero: Botanical[];
  ritual: string;
  inci: string;
  safety: string;
}

export interface Coupon { type: "pct" | "flat" | "freeship"; value: number; min?: number; label: string }

export const CONFIG = {
  whatsapp: "919999999999", // VERIFY — country code + number, no "+"
  email: "care@ekaorganics.in", // VERIFY
  freeShippingAt: 999,
  giftAt: 1499,
  shippingFee: 79,
  codFee: 49,
  /* Premium positioning: no public discounting. WELCOME is the newsletter
     welcome gift (complimentary shipping). Other codes are for partners /
     concierge use only and are never advertised on the site. */
  coupons: {
    WELCOME: { type: "freeship", value: 0, label: "Complimentary shipping on your first order" },
    EKAFIRST10: { type: "pct", value: 10, label: "Partner code" },
  } as Record<string, Coupon>,
};

/* ---------------------------------------------------------------------------
   PROOF POINTS — a claim is only shown when its flag is true.
   ⚠ Set a flag to true ONLY when you hold the supporting document.
   --------------------------------------------------------------------------- */
export const CLAIMS = {
  gmp: true,                 // VERIFY: manufacturer's GMP certificate on file
  dermatologistTested: true, // VERIFY: dermatologist test report + patch-test protocol on file
  crueltyFree: false,        // set true ONLY with certification (e.g. PETA / Leaping Bunny)
  organicCertified: false,   // set true ONLY with an organic certificate (e.g. NPOP / COSMOS)
};

export type ProofIcon = "leaf" | "shield" | "drop" | "heart" | "list";
export const PROOF_POINTS: { icon: ProofIcon; title: string; text: string }[] = [
  { icon: "leaf" as const, title: "Traceable sourcing", text: "Every botanical named, with its origin", show: true },
  { icon: "shield" as const, title: "GMP manufacturing", text: "Made in a GMP-compliant facility", show: CLAIMS.gmp },
  { icon: "drop" as const, title: "Dermatologist-tested", text: "With a patch-test protocol", show: CLAIMS.dermatologistTested },
  { icon: "heart" as const, title: "Cruelty-free", text: "Certified — never tested on animals", show: CLAIMS.crueltyFree },
  { icon: "list" as const, title: "Transparent formulas", text: "Short, fully disclosed ingredient lists", show: true },
].filter((p) => p.show).slice(0, 4).map(({ icon, title, text }) => ({ icon, title, text }));

/** Footnote used on ingredient lists — never says "certified" unless it is. */
export const ORGANIC_NOTE = CLAIMS.organicCertified ? "*Certified organic" : "*From organic farming";

export const whatsappUrl = (text = "Hi Eka Organics, I'd like help choosing a ritual.") =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

export const STAGES: Record<StageKey, { name: string; line: string; tone: string }> = {
  midlife: { name: "Women 40+", line: "A quiet nightly ritual for mature skin", tone: "#DCDDCC" },
  pregnancy: { name: "Pregnancy", line: "For the nine-month bloom", tone: "#E7DACB" },
  postpartum: { name: "Postpartum", line: "The sacred forty days — Sutika", tone: "#D9C8B8" },
  baby: { name: "Baby & Little Ones", line: "Malish rituals for tender skin", tone: "#EFE6DB" },
  sets: { name: "Gift Sets", line: "Curated rituals, beautifully boxed", tone: "#CDBBAA" },
};
export const isStage = (s: unknown): s is StageKey => typeof s === "string" && s in STAGES;

export const PRODUCTS: Product[] = [
  {
    id: "nabhi-ritual-oil",
    name: "Nabhi Ritual Oil",
    sub: "A gentle nightly navel oil, designed for women 40+",
    stage: "midlife", tags: ["signature", "new"],
    art: { type: "dropper", glass: "#7A4A22", cap: "#3D2F26", tone: "#E3D5C3", short: "Nabhi", kind: "Ritual Oil", size: "30 ml", collar: "#B07A4F" },
    variants: [ { size: "30 ml", price: 1450, mrp: 1450 } ], // VERIFY final price
    rating: 0, reviews: 0,
    concerns: ["Dry abdominal skin", "Nightly wind-down", "Mature skin"],
    forWhom: "Designed for women 40+, with a gentle low-fragrance formula and no added camphor.",
    packaging: "30 ml amber glass dropper with a minimal label and copper accents, in a recyclable outer carton.",
    benefits: [
      "Calms the senses with a soft lavender–frankincense aroma",
      "Nourishes and softens dry skin around the navel and abdomen",
      "Lightweight and fast-absorbing — no heavy residue",
      "Fully disclosed formula — no added camphor, mineral oil, parabens or synthetic fragrance",
    ],
    highlights: [
      { title: "Calms the senses", text: "A gentle lavender–frankincense aroma for your wind-down routine." },
      { title: "Nourishes dry skin", text: "Sesame, almond and coconut oils soften and condition the navel and abdominal area." },
      { title: "Feels non-sticky", text: "A lightweight, fast-absorbing massage oil that does not leave a heavy residue." },
      { title: "Supports a nightly ritual", text: "Creates a deliberate pause before sleep." },
      { title: "Made for mature skin", text: "Formulated with a gentle botanical base for women 40+." },
      { title: "Clean, transparent formula", text: "Fully disclosed ingredient list; no added camphor, mineral oil, parabens or synthetic fragrance." },
      { title: "Premium self-care", text: "Designed to feel like a small daily luxury — simple, sensory care for skin." },
    ],
    hero: [
      { name: "Sesame Oil", origin: "Ayurvedic carrier", note: "The classical base of abhyanga, with a rich massage feel." },
      { name: "Sweet Almond Oil", origin: "Conditioning", note: "Lightweight conditioning that helps the blend absorb." },
      { name: "Fractionated Coconut", origin: "Light texture", note: "Keeps the oil light and non-greasy." },
      { name: "Lavender & Frankincense", origin: "Low dilution", note: "A soft, low-fragrance aroma that calms the senses." },
    ],
    ingredients: [
      { name: "Sesame oil", inci: "Sesamum Indicum Seed Oil", role: "Traditional Ayurvedic carrier with a rich massage feel" },
      { name: "Sweet almond oil", inci: "Prunus Amygdalus Dulcis Oil", role: "Lightweight conditioning; helps the blend absorb" },
      { name: "Fractionated coconut oil", inci: "Caprylic/Capric Triglyceride", role: "Keeps the texture light and non-greasy" },
      { name: "Castor oil", inci: "Ricinus Communis Seed Oil", role: "Adds a cushioned richness to the massage" },
      { name: "Turmeric CO₂ extract", inci: "Curcuma Longa Root Extract", role: "Ayurvedic heritage botanical; gives a soft golden tone" },
      { name: "Ashwagandha extract", inci: "Withania Somnifera Root Extract", role: "Ayurvedic heritage botanical" },
      { name: "Shatavari extract", inci: "Asparagus Racemosus Root Extract", role: "Ayurvedic heritage botanical, long part of women's rituals" },
      { name: "Licorice extract", inci: "Glycyrrhiza Glabra Root Extract", role: "Helps soothe and condition skin" },
      { name: "Lavender essential oil", inci: "Lavandula Angustifolia Oil", role: "A familiar aroma that calms the senses" },
      { name: "Frankincense essential oil", inci: "Boswellia Serrata Oil", role: "A warm, resinous aroma for the ritual" },
      { name: "Vitamin E", inci: "Tocopherol", role: "Antioxidant that protects the oils" },
      { name: "Rosemary CO₂ extract", inci: "Rosmarinus Officinalis Leaf Extract", role: "Keeps the oils fresh" }, // VERIFY: final antioxidant choice
    ],
    ritual: "Before sleep, warm 2–4 drops between your fingertips. Massage gently into clean, dry skin around the navel in slow clockwise circles for about a minute, then take three slow breaths. Allow the oil to absorb before dressing.",
    // INCI order: descending concentration; ingredients ≤1% may appear in any order. VERIFY allergen list against supplier IFRA/allergen data.
    inci: "Sesamum Indicum (Sesame) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Caprylic/Capric Triglyceride, Ricinus Communis (Castor) Seed Oil, Tocopherol, Curcuma Longa (Turmeric) Root Extract, Withania Somnifera (Ashwagandha) Root Extract, Asparagus Racemosus (Shatavari) Root Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Lavandula Angustifolia (Lavender) Oil, Boswellia Serrata (Frankincense) Oil, Rosmarinus Officinalis (Rosemary) Leaf Extract, Linalool**, Limonene**. **Naturally occurring in essential oils.",
    safety: "For external use only. Patch test on the inner arm 24 hours before first use. Avoid broken or irritated skin and contact with eyes. Contains almond (tree-nut) oil. The oil has a soft golden tone from turmeric. Consult your doctor before use if pregnant, breastfeeding, or managing a medical or skin condition. Discontinue use if irritation occurs. A cosmetic oil, made to nourish, soften and condition the skin.",
    faq: [
      ["What is nabhi oil?", "Nabhi oil is a topical oil traditionally applied around the navel as part of an Ayurvedic self-care or massage ritual."],
      ["Who is this oil for?", "It is designed for women aged 40 and above who want a gentle, premium oil for navel and abdominal skin care and a calming nightly ritual."],
      ["How much should I use?", "Start with 2–4 drops. Massage gently into clean, dry skin around the navel."],
      ["Can I use it every night?", "Yes, if your skin tolerates it well. Discontinue use if irritation occurs."],
      ["Is it safe during pregnancy or breastfeeding?", "Consult your doctor before use if pregnant, breastfeeding, or managing a medical or skin condition."],
      ["What is Nabhi Ritual Oil not intended for?", "It is a cosmetic oil for massaging, softening and conditioning the skin around the navel. It is not intended for digestive, body-shape, or any internal or medical concern."],
      ["Will it stain clothes?", "The oil has a soft golden tone from turmeric. Use a small amount, allow it to absorb, and avoid immediate contact with light-coloured clothing."],
      ["What makes it suitable for women 40+?", "Its gentle, low-fragrance formula focuses on nourishing skin and a calming ritual, with no harsh herbs and no added camphor."],
      ["Why does the label say “no added camphor”?", "We never add camphor. Lavender and rosemary can contain tiny natural traces, so we say “no added camphor” rather than make a claim we cannot guarantee."],
    ],
  },
  {
    id: "bloom-belly-oil",
    name: "Bloom Belly Oil",
    sub: "Nourishing care for a growing belly, with Kokum, Rosehip & Calendula",
    stage: "pregnancy", tags: ["bestseller"],
    art: { type: "dropper", glass: "#8B5A2E", cap: "#3D2F26", tone: "#E7DACB", short: "Bloom", kind: "Belly Oil" },
    variants: [ { size: "100 ml", price: 1295, mrp: 1295 }, { size: "200 ml", price: 2195, mrp: 2195 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Growing belly", "Dry, tight-feeling skin", "Suppleness"],
    benefits: [
      "Keeps skin soft and supple as your belly grows",
      "Soothes dry, tight-feeling skin",
      "Deeply nourishes without a greasy finish",
      "Fragrance-free — gentle on heightened pregnancy senses",
    ],
    hero: [
      { name: "Kokum Butter", origin: "Konkan coast", note: "Rich in stearic acid to soften and support skin barrier." },
      { name: "Rosehip Seed Oil", origin: "Cold-pressed", note: "Naturally rich in essential fatty acids for supple skin." },
      { name: "Calendula", origin: "Sun-infused", note: "Soothes and comforts dry, sensitive skin." },
      { name: "Vitamin E", origin: "Plant-derived", note: "Antioxidant that protects the oil blend." },
    ],
    ritual: "From your second trimester, warm a few drops between your palms. Massage over belly, hips, thighs and breasts in slow clockwise circles, morning and night. Continue for 3 months postpartum.",
    inci: "Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Garcinia Indica (Kokum) Seed Butter*, Rosa Canina (Rosehip) Seed Oil*, Calendula Officinalis Flower Extract*, Simmondsia Chinensis (Jojoba) Seed Oil*, Tocopherol. " + ORGANIC_NOTE,
    safety: "Free from retinoids, salicylates, essential oils, mineral oil, parabens, phthalates and synthetic fragrance. Patch test before use. Consult your doctor if you have any concerns.",
  },
  {
    id: "velvet-belly-butter",
    name: "Velvet Belly Butter",
    sub: "Overnight balm of Kokum, Shea & Cocoa",
    stage: "pregnancy", tags: [],
    art: { type: "jar", glass: "#EADFD2", cap: "#48372D", tone: "#DCCBBA", short: "Velvet", kind: "Belly Butter" },
    variants: [ { size: "100 g", price: 1145, mrp: 1145 } ],
    rating: 4.7, reviews: 0,
    concerns: ["Dry, tight-feeling skin", "Overnight nourishment"],
    benefits: ["Melts into a velvet, non-sticky finish", "Intensive overnight nourishment", "Pairs with Bloom Belly Oil as a two-step ritual"],
    hero: [
      { name: "Kokum Butter", origin: "Konkan coast", note: "Softens and conditions." },
      { name: "Shea Butter", origin: "Fair-trade", note: "Locks in moisture." },
      { name: "Cocoa Butter", origin: "Kerala", note: "Comforting, rich emollient." },
    ],
    ritual: "Apply after Bloom Belly Oil at night, while skin is still warm, to seal in nourishment.",
    inci: "Garcinia Indica (Kokum) Seed Butter*, Butyrospermum Parkii (Shea) Butter*, Theobroma Cacao (Cocoa) Seed Butter*, Cocos Nucifera (Coconut) Oil*, Tocopherol. " + ORGANIC_NOTE,
    safety: "Fragrance-free. Free from parabens, phthalates and mineral oil. Patch test before use.",
  },
  {
    id: "sutika-postpartum-oil",
    name: "Sutika Postpartum Oil",
    sub: "Traditional Ayurvedic massage for the forty days",
    stage: "postpartum", tags: ["bestseller"],
    art: { type: "pump", glass: "#6E4A2C", cap: "#C9B39B", tone: "#D9C8B8", short: "Sutika", kind: "Massage Oil" },
    variants: [ { size: "200 ml", price: 1195, mrp: 1195 }, { size: "500 ml", price: 2495, mrp: 2495 } ],
    rating: 4.9, reviews: 0,
    concerns: ["Warming massage", "The forty days", "Rest & ritual"],
    benefits: ["A warming massage oil for the traditional forty-day Sutika ritual", "An unhurried, comforting full-body massage", "Inspired by classical Sutika Paricharya"],
    hero: [
      { name: "Bala", origin: "Classical herb", note: "A revered root of classical Ayurvedic massage oils." },
      { name: "Dashamoola", origin: "Ten-root blend", note: "Traditionally used for warmth and comfort." },
      { name: "Ashwagandha", origin: "Madhya Pradesh", note: "A classical root of traditional Sutika oils." },
      { name: "Cold-pressed Sesame", origin: "Wood-pressed", note: "The classical base for Abhyanga." },
    ],
    ritual: "Warm the oil gently. Massage the whole body in long strokes before a warm bath, ideally daily for the first 40 days after birth (or once your doctor approves, after a C-section).",
    inci: "Sesamum Indicum (Sesame) Seed Oil*, Sida Cordifolia (Bala) Root Extract*, Dashamoola Extract*, Withania Somnifera (Ashwagandha) Root Extract*, Tocopherol. " + ORGANIC_NOTE,
    safety: "Avoid application on stitches or open wounds. Patch test before use.",
  },
  {
    id: "nurture-nursing-balm",
    name: "Nurture Nursing Balm",
    sub: "Lanolin-free, food-grade care for nursing mothers",
    stage: "postpartum", tags: ["new"],
    art: { type: "tin", glass: "#C9B39B", cap: "#C9B39B", tone: "#E9DED2", short: "Nurture", kind: "Nursing Balm" },
    variants: [ { size: "30 g", price: 645, mrp: 645 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Dry, delicate skin", "Nursing"],
    benefits: ["Food-grade ingredients — no need to wipe off before feeding", "Softens and comforts dry, delicate skin", "Lanolin-free and fragrance-free"],
    hero: [
      { name: "Virgin Coconut Oil", origin: "Kerala", note: "Gentle and soothing." },
      { name: "Calendula", origin: "Sun-infused", note: "Comforts tender skin." },
      { name: "Kokum Butter", origin: "Konkan", note: "Protective, non-greasy." },
    ],
    ritual: "Apply a small amount after each feed. Food-grade formula.",
    inci: "Cocos Nucifera (Coconut) Oil*, Garcinia Indica (Kokum) Seed Butter*, Calendula Officinalis Flower Extract*, Cera Alba (Beeswax)*. " + ORGANIC_NOTE,
    safety: "Food-grade ingredients. Consult a lactation specialist for persistent discomfort.",
  },
  {
    id: "mama-hair-elixir",
    name: "Mama Hair Elixir",
    sub: "Bhringraj & Amla scalp oil for the months after birth",
    stage: "postpartum", tags: [],
    art: { type: "dropper", glass: "#5E3F27", cap: "#C9B39B", tone: "#D2C0AE", short: "Mama", kind: "Hair Elixir" },
    variants: [ { size: "100 ml", price: 895, mrp: 895 } ],
    rating: 4.6, reviews: 0,
    concerns: ["Scalp care", "Dry scalp"],
    benefits: ["Nourishes the scalp in the months after birth", "Conditions lengths with a classical herb infusion", "Light, washes out easily"],
    hero: [
      { name: "Bhringraj", origin: "Classical herb", note: "The 'king of hair' in Ayurveda." },
      { name: "Amla", origin: "Pratapgarh", note: "Vitamin-C rich fruit for hair." },
      { name: "Methi", origin: "Rajasthan", note: "Conditions and softens." },
    ],
    ritual: "Massage into scalp 1 hour before washing, 2–3 times a week.",
    inci: "Sesamum Indicum Seed Oil*, Eclipta Alba (Bhringraj) Extract*, Emblica Officinalis (Amla) Fruit Extract*, Trigonella Foenum-Graecum (Methi) Seed Extract*, Tocopherol. " + ORGANIC_NOTE,
    safety: "Patch test before use.",
  },
  {
    id: "malish-baby-oil",
    name: "Malish Baby Massage Oil",
    sub: "Cold-pressed, fragrance-free for daily malish",
    stage: "baby", tags: ["bestseller"],
    art: { type: "bottle", glass: "#EFE6DB", cap: "#78665A", tone: "#EFE6DB", short: "Malish", kind: "Baby Oil" },
    variants: [ { size: "100 ml", price: 695, mrp: 695 }, { size: "200 ml", price: 1095, mrp: 1095 } ],
    rating: 4.9, reviews: 0,
    concerns: ["Daily massage", "Dry skin", "Bonding"],
    benefits: ["Light, quickly absorbed for tiny limbs", "Fragrance-free and essential-oil-free", "Inspired by the traditional Indian malish ritual"],
    hero: [
      { name: "Cold-pressed Coconut", origin: "Kerala", note: "Light and gentle." },
      { name: "Sweet Almond", origin: "Cold-pressed", note: "Softens delicate skin." },
      { name: "Sesame", origin: "Wood-pressed", note: "Classical warming malish base." },
    ],
    ritual: "Warm a few drops in your palms and massage your baby gently before bath time, using light strokes from the centre outwards.",
    inci: "Cocos Nucifera (Coconut) Oil*, Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Sesamum Indicum (Sesame) Seed Oil*, Tocopherol. " + ORGANIC_NOTE,
    safety: "Suitable from birth. Patch test on a small area. Avoid eyes, nostrils and the umbilical stump until it has dried and fallen away.",
  },
  {
    id: "soothe-baby-balm",
    name: "Soothe Baby Balm",
    sub: "Calendula comfort for nappy areas & dry patches",
    stage: "baby", tags: [],
    art: { type: "jar", glass: "#F3ECE3", cap: "#C9B39B", tone: "#E6D9CB", short: "Soothe", kind: "Baby Balm" },
    variants: [ { size: "50 g", price: 595, mrp: 595 } ],
    rating: 4.8, reviews: 0,
    concerns: ["Nappy area", "Dry patches"],
    benefits: ["Forms a gentle protective layer", "Comforts dry, delicate skin", "Fragrance-free"],
    hero: [
      { name: "Calendula", origin: "Sun-infused", note: "Classic soothing botanical." },
      { name: "Shea Butter", origin: "Fair-trade", note: "Protects and nourishes." },
    ],
    ritual: "Apply a thin layer at every nappy change or on dry patches.",
    inci: "Butyrospermum Parkii (Shea) Butter*, Cocos Nucifera Oil*, Calendula Officinalis Flower Extract*, Cera Alba*. " + ORGANIC_NOTE,
    safety: "Suitable from birth. For external use only.",
  },
  {
    id: "baby-ubtan",
    name: "Baby Ubtan Bath Powder",
    sub: "Soap-free cleanse of besan, oats & almond",
    stage: "baby", tags: ["new"],
    art: { type: "tube", glass: "#E2D3C3", cap: "#48372D", tone: "#E9DCCD", short: "Ubtan", kind: "Bath Powder" },
    variants: [ { size: "100 g", price: 545, mrp: 545 } ],
    rating: 4.7, reviews: 0,
    concerns: ["Gentle cleansing", "Soap-free"],
    benefits: ["Grandmother's soap-free ubtan, made gentle", "Cleanses without stripping natural oils", "No sulphates, no foam agents"],
    hero: [
      { name: "Besan", origin: "Stone-ground", note: "Traditional gentle cleanser." },
      { name: "Colloidal Oats", origin: "Fine-milled", note: "Comforting for dry skin." },
      { name: "Almond", origin: "Stone-ground", note: "Soft polish." },
    ],
    ritual: "From 6 months. Mix a spoonful with milk or water into a paste, smooth over skin after malish and rinse.",
    inci: "Cicer Arietinum (Chickpea) Flour*, Avena Sativa (Oat) Kernel Flour*, Prunus Amygdalus Dulcis (Almond) Meal*. " + ORGANIC_NOTE,
    safety: "For babies 6 months+. Patch test before use.",
  },
  {
    id: "nine-month-ritual",
    name: "The Nine-Month Ritual",
    sub: "Bloom Belly Oil + Velvet Belly Butter + Mama Hair Elixir",
    stage: "sets", tags: ["bestseller", "set"],
    art: { type: "box", glass: "#3D2F26", cap: "#C9B39B", tone: "#CDBBAA", short: "Nine-Month", kind: "Ritual Set" },
    variants: [ { size: "Set of 3", price: 2795, mrp: 2795 } ],
    rating: 4.9, reviews: 0,
    includes: ["bloom-belly-oil", "velvet-belly-butter", "mama-hair-elixir"],
    concerns: ["Gifting", "Complete pregnancy care"],
    benefits: ["The complete belly-care ritual for all three trimesters", "Hand-finished keepsake box with a ritual card", "Arrives in a recyclable outer carton"],
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
    variants: [ { size: "Set of 3", price: 1595, mrp: 1595 } ],
    rating: 4.9, reviews: 0,
    includes: ["malish-baby-oil", "soothe-baby-balm", "baby-ubtan"],
    concerns: ["Gifting", "New baby"],
    benefits: ["Everything for your baby's daily malish & bath ritual", "The most-loved baby shower gift", "Arrives in a recyclable outer carton"],
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
    variants: [ { size: "Set of 4", price: 3295, mrp: 3295 } ],
    rating: 5.0, reviews: 0,
    includes: ["sutika-postpartum-oil", "nurture-nursing-balm", "malish-baby-oil", "soothe-baby-balm"],
    concerns: ["Gifting", "Postpartum"],
    benefits: ["A thoughtful gift for a new mother and her baby", "Includes a handwritten note on request", "Arrives in a recyclable outer carton"],
    hero: [],
    ritual: "Mother: Sutika Oil daily and Nurture Balm after feeds. Baby: Malish Oil before bath, Soothe Balm at changes.",
    inci: "See individual products.",
    safety: "See individual products.",
  },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const getProduct = (id: string): Product | undefined => PRODUCT_MAP[id];

/** Complementary product shown as "Pairs beautifully with" on product pages. */
export const PAIRS: Record<string, string> = {
  "nabhi-ritual-oil": "mama-hair-elixir",
  "bloom-belly-oil": "velvet-belly-butter",
  "velvet-belly-butter": "bloom-belly-oil",
  "sutika-postpartum-oil": "mama-hair-elixir",
  "nurture-nursing-balm": "sutika-postpartum-oil",
  "mama-hair-elixir": "sutika-postpartum-oil",
  "malish-baby-oil": "soothe-baby-balm",
  "soothe-baby-balm": "malish-baby-oil",
  "baby-ubtan": "malish-baby-oil",
};

/* Testimonials — VERIFY: placeholders. Replace with real reviews (with consent) or remove. */
export const REVIEWS = [
  { name: "Customer name", city: "City", product: "Bloom Belly Oil", text: "Replace this with a genuine customer review. Real words from real mothers convert far better than polished copy.", stars: 5 },
  { name: "Customer name", city: "City", product: "Malish Baby Massage Oil", text: "Replace this with a genuine customer review — ideally one that mentions texture, scent and how their baby took to the malish.", stars: 5 },
  { name: "Customer name", city: "City", product: "Welcome Home Hamper", text: "Replace this with a genuine review from someone who gifted the hamper — gifting stories drive set sales.", stars: 5 },
];

export const FAQ: [string, string][] = [
  ["How are Eka formulas made?", "Traditional inspiration, modern formulation, transparent ingredients. Every botanical is named with its origin, and every product carries its full ingredient list."],
  ["Which products are designed for pregnancy?", "Our pregnancy range is formulated without retinoids, salicylates, essential oils and synthetic fragrance. Every body is different, so we recommend a patch test and a word with your doctor."],
  ["When should I start using Bloom Belly Oil?", "Most mothers begin in the second trimester, when the belly starts to grow quickly, and continue for about three months after birth. Using it every day matters more than how much you apply."],
  ["Can the Malish Oil be used on newborns?", "Yes — it is fragrance-free and suitable from birth. Avoid the umbilical stump until it has dried and fallen away, and patch test on a small area first."],
  ["How long does delivery take?", "Metro cities: 1–3 working days. Rest of India: 3–6 working days. Enter your PIN code on any product page for an estimate."],
  ["Is Cash on Delivery available?", "Yes, on most PIN codes across India, for a small handling fee of ₹49."],
  ["What is your return policy?", "Unopened products can be returned within 7 days of delivery. If anything arrives damaged, WhatsApp us a photo within 48 hours and we'll replace it."],
];
