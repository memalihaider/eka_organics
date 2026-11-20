import Image from "next/image";
import Link from "next/link";
import { CLAIMS, PRODUCT_MAP, REVIEWS, STAGES, whatsappUrl, type StageKey } from "@/lib/data";
import { inr, stars } from "@/lib/format";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import { FaqList, LeafShadow, TrustBar } from "@/components/Sections";
import { AddToBag, QuizButton } from "@/components/store/Buttons";
import { Arrow, Drop, Leaf, List, Moon } from "@/components/Icons";

const BESTSELLERS = ["nabhi-ritual-oil", "bloom-belly-oil", "sutika-postpartum-oil", "malish-baby-oil", "nine-month-ritual", "velvet-belly-butter", "mama-hair-elixir", "first-malish-kit"];
const STAGE_ART: Record<StageKey, string> = { midlife: "nabhi-ritual-oil", pregnancy: "bloom-belly-oil", postpartum: "sutika-postpartum-oil", baby: "malish-baby-oil", body: "nabhi-kund-oil", sets: "welcome-home-hamper" };

const PILLARS = [
  { icon: Leaf, title: <>Traditional <em>inspiration</em></>, text: "Rituals drawn from Ayurveda — nabhi abhyanga, malish, Sutika care — practised by Indian women for generations." },
  {
    icon: Drop, title: <>Modern <em>formulation</em></>,
    // Proof claims follow the CLAIMS flags in data.ts
    text: ["Gentle, low-fragrance bases, made in small batches",
      CLAIMS.gmp && "in GMP-compliant facilities",
      CLAIMS.dermatologistTested && "and dermatologist-tested with a patch-test protocol"].filter(Boolean).join(" ") + ".",
  },
  { icon: List, title: <>Transparent <em>ingredients</em></>, text: "Short lists, fully disclosed. Every botanical is named with its origin — nothing hidden behind “fragrance”." },
];

const RITUAL = [
  ["Warm", "Warm 2–4 drops between your fingertips."],
  ["Massage", "Gently massage clean, dry skin around the navel in slow clockwise circles."],
  ["Breathe", "Pause for three slow breaths. Let the aroma settle."],
  ["Rest", "Allow it to absorb before dressing, and let the day go."],
];

const PROVENANCE = [
  ["Cold-pressed Sesame", "Tamil Nadu", "The classical base oil of Ayurvedic abhyanga, slow-pressed to keep its warmth."],
  ["Virgin Coconut", "Kerala", "Cold-pressed from fresh kernels — light, gentle and fast-absorbing."],
  ["Kokum Butter", "Konkan Coast, Maharashtra", "Pressed from Garcinia seeds into a butter that softens without heaviness."],
  ["Calendula & Bala", "Himalayan foothills", "Sun-infused flowers and revered roots from classical Ayurvedic massage oils."],
];
const FREE_FROM = [["Added camphor", "Gentle for mature skin"], ["Mineral oil", "Only plant oils"], ["Parabens", "Never in our bottles"], ["Synthetic fragrance", "Botanical aroma only"], ["Phthalates", "None, ever"], ["Silicones", "Breathable formulas"], ["Sulphates", "Soap-free cleansing"], ["Retinoids", "Absent from our pregnancy range"]];

export default function Home() {
  const nabhi = PRODUCT_MAP["nabhi-ritual-oil"], set = PRODUCT_MAP["nine-month-ritual"];
  const setParts = set.includes!.map((id) => PRODUCT_MAP[id]);

  return (
    <>
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">— Nabhi Ritual Oil · designed for women 40+ —</p>
            <h1 className="h-xl">A quiet ritual for <em>the woman you are now.</em></h1>
            <p className="lead">Inspired by the Ayurvedic tradition of navel massage. A gentle, low-fragrance botanical oil that softens skin and creates a deliberate pause before sleep.</p>
            <div className="hero__ctas">
              <Link className="btn btn--light" href="/products/nabhi-ritual-oil">Discover Nabhi Oil</Link>
              <QuizButton className="btn btn--outline-light">Find your ritual</QuizButton>
            </div>
            <div className="hero__proof">
              <div><b>30 ml</b>Amber glass dropper</div>
              <div><b>No added camphor</b>Low-fragrance formula</div>
              <div><b>Since 2018</b>Rooted in Ayurveda</div>
            </div>
          </div>
          <div className="hero__visual">
            <LeafShadow />
            <Image className="hero__mono" src="/img/monogram.png" alt="" width={220} height={200} priority />
            <div className="art" style={{ inset: "16% 12% 0 12%" }}><ProductArt p={nabhi} bg={false} /></div>
            <Link className="float-card float-card--a" href="/products/nabhi-ritual-oil"><div><b>Nabhi Ritual Oil</b>30 ml · {inr(nabhi.variants[0].price)}</div><Arrow /></Link>
            <div className="float-card float-card--b"><div><b>Lavender · Frankincense</b>A soft, low-fragrance aroma</div></div>
          </div>
        </div>
      </section>
      <TrustBar />

      <section className="section"><div className="container">
        <div className="center rv" style={{ marginBottom: 48 }}>
          <p className="eyebrow">— The Eka way —</p>
          <h2 className="h-lg">Old wisdom, <em>made honest</em></h2>
        </div>
        <div className="pillars rv">
          {PILLARS.map(({ icon: Icon, title, text }, i) => <div className="pillar" key={i}><Icon /><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container feature">
        <div className="feature__media rv"><ProductArt p={nabhi} tone="#E3D5C3" /><div className="feature__badge">Our<br />signature<br />ritual</div></div>
        <div className="feature__copy rv">
          <p className="eyebrow">— Signature · Nabhi Ritual Oil —</p>
          <h2 className="h-lg">A pause, <em>before sleep</em></h2>
          <p className="lead">Sesame, almond and light coconut oils with turmeric, ashwagandha, shatavari and licorice, and a whisper of lavender and frankincense — a small daily luxury for navel and abdominal skin, and for the quiet minute it gives you.</p>
          <div className="for-whom"><Moon /><span><b>Designed for women 40+</b>, with a gentle low-fragrance formula and no added camphor.</span></div>
          <div className="highlights">{nabhi.highlights!.map((h) => <div key={h.title}><b>{h.title}</b><p>{h.text}</p></div>)}</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddToBag id="nabhi-ritual-oil">Add to bag · {inr(nabhi.variants[0].price)}</AddToBag>
            <Link className="btn btn--ghost" href="/products/nabhi-ritual-oil">The full story</Link>
          </div>
          <p className="note-honest">A cosmetic oil, made to nourish, soften and condition the skin around the navel — and to support a calming nightly ritual.</p>
        </div>
      </div></section>

      <section className="section" style={{ background: "var(--ivory)" }}><div className="container">
        <div className="sec-head rv"><div><p className="eyebrow">— The nightly ritual —</p><h2 className="h-lg">One minute, <em>four steps</em></h2></div></div>
        <div className="steps-ritual rv">{RITUAL.map(([t, d]) => <div key={t}><h4>{t}</h4><p>{d}</p></div>)}</div>
      </div></section>

      <section className="section"><div className="container">
        <div className="sec-head rv"><div><p className="eyebrow">— Shop by chapter —</p><h2 className="h-lg">A ritual for <em>every season of life</em></h2></div>
          <Link className="link-u" href="/shop">View all</Link></div>
        <div className="stages">
          {(Object.keys(STAGES) as StageKey[]).map((k, i) => (
            <Link key={k} className="stage rv" href={`/shop?stage=${k}`} style={{ background: STAGES[k].tone }}>
              <div className="stage__art"><ProductArt p={PRODUCT_MAP[STAGE_ART[k]]} tone={STAGES[k].tone} alt={i % 2 === 1} /></div>
              <span className="arrow"><Arrow /></span>
              <span className="stage__n">0{i + 1}</span><h3>{STAGES[k].name}</h3><p>{STAGES[k].line}</p>
            </Link>
          ))}
        </div>
      </div></section>

      <section className="section" style={{ background: "var(--ivory)" }}><div className="container">
        <div className="sec-head rv"><div><p className="eyebrow">— Most loved —</p><h2 className="h-lg">The collection</h2></div><Link className="link-u" href="/shop">Shop all</Link></div>
        <div className="grid">{BESTSELLERS.map((id) => <ProductCard key={id} p={PRODUCT_MAP[id]} />)}</div>
      </div></section>

      <section className="band"><div className="container band__inner">
        <Image className="band__mono rv" src="/img/monogram.png" alt="" width={220} height={200} />
        <div className="rv"><p className="eyebrow eyebrow--light">— A 60-second consultation —</p><h2 className="h-lg">Not sure where <em>to begin?</em></h2>
          <p>Tell us which chapter you are in — midlife, pregnancy, postpartum or your baby&apos;s first years — and we&apos;ll suggest a ritual.</p></div>
        <QuizButton className="btn btn--light rv">Find your ritual</QuizButton>
      </div></section>

      <section className="section"><div className="container">
        <div className="center rv" style={{ marginBottom: 56 }}><p className="eyebrow">— Ingredient sourcing —</p><h2 className="h-lg">From Indian soil, <em>with intention</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Every botanical is chosen for gentleness and the place it grows best — then cold-pressed or slow-infused in small batches.</p></div>
        <div className="prov">{PROVENANCE.map(([n, o, t], i) => <div className="prov__item rv" key={n}><span className="prov__num">0{i + 1}</span><h4>{n}</h4><small>{o}</small><p>{t}</p></div>)}</div>
      </div></section>

      <section className="section bundle"><div className="container bundle__grid">
        <div className="bundle__media rv"><ProductArt p={set} tone="#CDBBAA" /></div>
        <div className="rv">
          <p className="eyebrow">— For the mother-to-be —</p>
          <h2 className="h-lg" style={{ marginTop: 12 }}>The Nine-Month <em>Ritual</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Three formulas for the three trimesters, hand-finished in a keepsake box with a ritual card, inside a recyclable outer carton.</p>
          <div className="bundle__items">
            {setParts.map((p) => <div className="bundle__item" key={p.id}><span className="thumb"><ProductArt p={p} /></span><span><b>{p.name}</b><small>{p.variants[0].size}</small></span></div>)}
          </div>
          <div className="bundle__price"><b>{inr(set.variants[0].price)}</b><span style={{ color: "var(--muted)", fontSize: 13 }}>Inclusive of all taxes</span></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><AddToBag id="nine-month-ritual">Add the ritual to bag</AddToBag><Link className="btn btn--ghost" href="/shop?stage=sets">All gift sets</Link></div>
        </div>
      </div></section>

      <section className="section promise"><div className="container center">
        <p className="eyebrow eyebrow--light rv">— Transparent by design —</p>
        <h2 className="h-lg rv" style={{ margin: "12px 0 18px" }}>A short list, <em>fully disclosed</em></h2>
        <p className="lead rv">We would rather tell you exactly what is in the bottle than promise what it cannot do.</p>
        <div className="freefrom rv">{FREE_FROM.map(([a, b]) => <div key={a}><span>{a}</span><small>{b}</small></div>)}</div>
      </div></section>

      <section className="section"><div className="container">
        <div className="center rv" style={{ marginBottom: 48 }}><p className="eyebrow">— In their words —</p><h2 className="h-lg">Kind <em>words</em></h2></div>
        <div className="reviews">
          {REVIEWS.map((r, i) => <blockquote className="review rv" style={{ margin: 0 }} key={i}><span className="stars">{stars(r.stars)}</span><p>{r.text}</p><footer><b>{r.name}, {r.city}</b>on {r.product}</footer></blockquote>)}
        </div>
        <p className="placeholder-note">Preview note: placeholder testimonials — replace with genuine customer reviews in src/lib/data.ts before launch.</p>
      </div></section>

      <section className="split">
        <div className="split__img rv" role="img" aria-label="Eka Organics, established 2018" />
        <div className="split__copy rv">
          <p className="eyebrow">— Our story —</p>
          <h2 className="h-lg">Eka — <em>the one.</em></h2>
          <p className="lead">Eka means “one” in Sanskrit. We began in 2018 with a single oil, inspired by the rituals passed between generations of Indian women — the malish, the Sutika oils, the evening nabhi massage.</p>
          <p className="lead">Today we make small-batch formulas for every chapter of a woman&apos;s life: traditional inspiration, modern formulation, transparent ingredients.</p>
          <p className="sig">With care, the Eka family</p>
          <Link className="btn btn--ghost" href="/story">Read our story</Link>
        </div>
      </section>

      <section className="section"><div className="container faq-wrap">
        <div className="rv"><p className="eyebrow">— About nabhi oil —</p><h2 className="h-lg" style={{ marginTop: 12 }}>Gentle <em>guidance</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Questions about your ritual? Our care team replies on WhatsApp, 10am–7pm IST.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
            <a className="btn btn--ghost" href={whatsappUrl()} target="_blank" rel="noopener">Ask on WhatsApp</a>
            <Link className="link-u" href="/faq" style={{ alignSelf: "center" }}>All FAQs</Link>
          </div></div>
        <div className="acc rv"><FaqList items={nabhi.faq!} /></div>
      </div></section>
    </>
  );
}
