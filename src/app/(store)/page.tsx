import Image from "next/image";
import Link from "next/link";
import { FAQ, PRODUCT_MAP, REVIEWS, STAGES, whatsappUrl, type StageKey } from "@/lib/data";
import { inr, stars } from "@/lib/format";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import { FaqList, LeafShadow, TrustBar } from "@/components/Sections";
import { AddToBag, QuizButton } from "@/components/store/Buttons";
import { Arrow } from "@/components/Icons";

const BESTSELLERS = ["bloom-belly-oil", "sutika-postpartum-oil", "malish-baby-oil", "nine-month-ritual", "velvet-belly-butter", "nurture-nursing-balm", "first-malish-kit", "soothe-baby-balm"];
const STAGE_ART: Record<StageKey, string> = { pregnancy: "bloom-belly-oil", postpartum: "sutika-postpartum-oil", baby: "malish-baby-oil", sets: "welcome-home-hamper" };

const PROVENANCE = [
  ["Kokum Butter", "Konkan Coast, Maharashtra", "Wild-harvested Garcinia seeds, pressed into a butter that softens skin without heaviness."],
  ["Virgin Coconut", "Kerala", "Cold-pressed from fresh kernels — the gentle base of our malish and nursing care."],
  ["Wood-pressed Sesame", "Tamil Nadu", "The classical base oil of Ayurvedic Abhyanga, slow-pressed to keep its warmth."],
  ["Calendula & Bala", "Himalayan foothills", "Sun-infused flowers and revered roots for comfort and restoration."],
];
const FREE_FROM = [["Parabens", "Preservative-free oils"], ["Phthalates", "Never in our bottles"], ["Mineral oil", "Only plant oils"], ["Synthetic fragrance", "Unscented by design"], ["Retinoids", "Pregnancy-safe actives"], ["Sulphates", "Soap-free cleansing"], ["Silicones", "Breathable formulas"], ["Animal testing", "100% cruelty-free"]];

export default function Home() {
  const bloom = PRODUCT_MAP["bloom-belly-oil"], butter = PRODUCT_MAP["velvet-belly-butter"], set = PRODUCT_MAP["nine-month-ritual"];
  const setParts = set.includes!.map((id) => PRODUCT_MAP[id]);
  const setMrp = setParts.reduce((s, p) => s + p.variants[0].price, 0);
  const setPrice = set.variants[0].price;

  return (
    <>
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">— Ayurvedic care for mother &amp; child —</p>
            <h1 className="h-xl">Nurture <em>the bloom,</em><br />cherish the beginning.</h1>
            <p className="lead">Certified-organic belly oils, postpartum rituals and gentle baby care — rooted in the wisdom of Ayurveda, made for the most tender chapters of life.</p>
            <div className="hero__ctas">
              <Link className="btn btn--light" href="/products/bloom-belly-oil">Shop Bloom Belly Oil</Link>
              <QuizButton className="btn btn--outline-light">Find your ritual</QuizButton>
            </div>
            <div className="hero__proof">
              <div><b>Since 2018</b>Rooted in Ayurveda</div>
              <div><b>0%</b>Synthetic fragrance</div>
              <div><b>COD</b>Across India</div>
            </div>
          </div>
          <div className="hero__visual">
            <LeafShadow />
            <Image className="hero__mono" src="/img/monogram.png" alt="" width={220} height={200} priority />
            <div className="art" style={{ inset: "14% 4% 2% 22%" }}><ProductArt p={bloom} bg={false} /></div>
            <div className="art" style={{ inset: "44% 46% 0 -4%" }}><ProductArt p={butter} bg={false} /></div>
            <Link className="float-card float-card--a" href="/products/bloom-belly-oil"><div><b>Bloom Belly Oil</b>Our signature · from {inr(bloom.variants[0].price)}</div><Arrow /></Link>
            <div className="float-card float-card--b"><div><b>Pregnancy-safe</b>Fragrance-free · Retinoid-free</div></div>
          </div>
        </div>
      </section>
      <TrustBar />

      <section className="section"><div className="container">
        <div className="sec-head rv"><div><p className="eyebrow">— Shop by moment —</p><h2 className="h-lg">A ritual for <em>every chapter</em></h2></div>
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

      <section className="section" style={{ paddingTop: 0 }}><div className="container feature">
        <div className="feature__media rv"><ProductArt p={bloom} tone="#EADFD2" /><div className="feature__badge">Our<br />signature<br />blend</div></div>
        <div className="feature__copy rv">
          <p className="eyebrow">— The hero of the nine months —</p>
          <h2 className="h-lg">Bloom <em>Belly Oil</em></h2>
          <p className="lead">A cold-pressed blend of Konkan Kokum, Rosehip and sun-infused Calendula to keep growing skin supple, comfortable and deeply nourished — from the second trimester to the fourth.</p>
          <div className="ing-list">{bloom.hero.map((h) => <div key={h.name}><small>{h.origin}</small><b>{h.name}</b><p>{h.note}</p></div>)}</div>
          <div className="timeline">
            <div><b>Trimester 2</b><span>Begin the ritual as your belly starts to grow</span></div>
            <div><b>Trimester 3</b><span>Twice daily, with Velvet Belly Butter at night</span></div>
            <div><b>The 4th</b><span>Continue for 3 months after birth</span></div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddToBag id="bloom-belly-oil">Add to bag · {inr(bloom.variants[0].price)}</AddToBag>
            <Link className="btn btn--ghost" href="/products/bloom-belly-oil">Discover more</Link>
          </div>
        </div>
      </div></section>

      <section className="section" style={{ background: "var(--ivory)" }}><div className="container">
        <div className="sec-head rv"><div><p className="eyebrow">— Most loved —</p><h2 className="h-lg">Bestsellers</h2></div><Link className="link-u" href="/shop">Shop all</Link></div>
        <div className="grid">{BESTSELLERS.map((id) => <ProductCard key={id} p={PRODUCT_MAP[id]} />)}</div>
      </div></section>

      <section className="band"><div className="container band__inner">
        <Image className="band__mono rv" src="/img/monogram.png" alt="" width={220} height={200} />
        <div className="rv"><p className="eyebrow eyebrow--light">— 60-second consultation —</p><h2 className="h-lg">Not sure where <em>to begin?</em></h2>
          <p>Tell us where you are in your journey — pregnancy, postpartum or your baby&apos;s first years — and we&apos;ll curate a ritual for you.</p></div>
        <QuizButton className="btn btn--light rv">Find your ritual</QuizButton>
      </div></section>

      <section className="section"><div className="container">
        <div className="center rv" style={{ marginBottom: 56 }}><p className="eyebrow">— Sacred provenance —</p><h2 className="h-lg">From Indian soil, <em>with intention</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Every botanical is chosen for purity, gentleness and the place it grows best — then cold-pressed or slow-infused in small batches.</p></div>
        <div className="prov">{PROVENANCE.map(([n, o, t], i) => <div className="prov__item rv" key={n}><span className="prov__num">0{i + 1}</span><h4>{n}</h4><small>{o}</small><p>{t}</p></div>)}</div>
      </div></section>

      <section className="section bundle"><div className="container bundle__grid">
        <div className="bundle__media rv"><ProductArt p={set} tone="#CDBBAA" /></div>
        <div className="rv">
          <p className="eyebrow">— The complete ritual · save {inr(setMrp - setPrice)} —</p>
          <h2 className="h-lg" style={{ marginTop: 12 }}>The Nine-Month <em>Ritual</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Everything a mother-to-be needs, hand-finished in a keepsake box with a ritual card. The gift every baby shower remembers.</p>
          <div className="bundle__items">
            {setParts.map((p) => <div className="bundle__item" key={p.id}><span className="thumb"><ProductArt p={p} /></span><span><b>{p.name}</b><small>{p.variants[0].size}</small></span><span className="p">{inr(p.variants[0].price)}</span></div>)}
          </div>
          <div className="bundle__price"><b>{inr(setPrice)}</b><s>{inr(setMrp)}</s><span style={{ color: "var(--ok)", fontWeight: 500 }}>Save {Math.round((1 - setPrice / setMrp) * 100)}%</span></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><AddToBag id="nine-month-ritual">Add the ritual to bag</AddToBag><Link className="btn btn--ghost" href="/shop?stage=sets">All gift sets</Link></div>
        </div>
      </div></section>

      <section className="section promise"><div className="container center">
        <p className="eyebrow eyebrow--light rv">— The Eka promise —</p>
        <h2 className="h-lg rv" style={{ margin: "12px 0 18px" }}>What we <em>leave out</em> matters most</h2>
        <p className="lead rv">When it touches a growing belly or a newborn&apos;s skin, there is no room for compromise.</p>
        <div className="freefrom rv">{FREE_FROM.map(([a, b]) => <div key={a}><span>{a}</span><small>{b}</small></div>)}</div>
      </div></section>

      <section className="section"><div className="container">
        <div className="center rv" style={{ marginBottom: 48 }}><p className="eyebrow">— From our mothers —</p><h2 className="h-lg">Words of <em>love</em></h2></div>
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
          <p className="lead">Eka means “one” in Sanskrit: one mother, one child, one unbreakable bond. We began in 2018 with a single belly oil, inspired by the malish and Sutika rituals passed down through generations of Indian women.</p>
          <p className="lead">Today, every Eka formulation is made in small batches with certified-organic botanicals — honest enough for pregnancy, gentle enough for a newborn.</p>
          <p className="sig">With love, the Eka family</p>
          <Link className="btn btn--ghost" href="/story">Read our story</Link>
        </div>
      </section>

      <section className="section"><div className="container faq-wrap">
        <div className="rv"><p className="eyebrow">— Questions, answered —</p><h2 className="h-lg" style={{ marginTop: 12 }}>Gentle <em>guidance</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>Still unsure? Our care team replies on WhatsApp within the hour, 10am–7pm IST.</p>
          <a className="btn btn--ghost" style={{ marginTop: 26 }} href={whatsappUrl()} target="_blank" rel="noopener">Ask on WhatsApp</a></div>
        <div className="acc rv"><FaqList items={FAQ} /></div>
      </div></section>
    </>
  );
}
