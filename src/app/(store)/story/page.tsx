import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrustBar } from "@/components/Sections";

export const metadata: Metadata = { title: "Our Story", description: "Eka means one — one mother, one child, one bond. The story behind Eka Organics, est. 2018." };

const STEPS = [
  ["Sourced with care", "Organic farms across India", "We work with growers we know by name — Kokum from the Konkan, coconut from Kerala, sesame from Tamil Nadu."],
  ["Pressed, not processed", "Cold & wood-pressed", "Our oils are never heat-refined or bleached, so they keep the nutrients nature gave them."],
  ["Formulated for two", "Pregnancy & baby-safe", "Every formula is free from retinoids, essential oils, synthetic fragrance and harsh preservatives."],
  ["Made in small batches", "Hand-filled in India", "Fresh batches, batch-coded and dated, so you always know exactly what you're using."],
];

export default function Story() {
  return (
    <>
      <section className="split" style={{ minHeight: "70vh" }}>
        <div className="split__img" />
        <div className="split__copy">
          <p className="eyebrow">— estd 2018 —</p>
          <h1 className="h-lg">Eka — <em>the one.</em></h1>
          <p className="lead">In Sanskrit, <i>eka</i> means one. One mother. One child. One bond that begins long before the first heartbeat is heard.</p>
          <p className="lead">Eka Organics was born from the rituals of Indian motherhood — the daily malish, the warm oils of the Sutika period, the ubtan our grandmothers mixed by hand — and from a simple question: why should the products we use in these tender moments contain anything we can&apos;t pronounce?</p>
        </div>
      </section>
      <section className="section"><div className="container">
        <div className="center" style={{ marginBottom: 56 }}><p className="eyebrow">— How we make —</p><h2 className="h-lg">Slow, small, <em>sincere</em></h2></div>
        <div className="prov">{STEPS.map(([n, o, t], i) => <div className="prov__item rv" key={n}><span className="prov__num">0{i + 1}</span><h4>{n}</h4><small>{o}</small><p>{t}</p></div>)}</div>
      </div></section>
      <section className="band"><div className="container band__inner">
        <Image className="band__mono" src="/img/monogram.png" alt="" width={220} height={200} />
        <div><h2 className="h-lg">Begin your <em>ritual</em></h2><p>Find the formulations made for where you are today.</p></div>
        <Link className="btn btn--light" href="/shop">Shop all</Link>
      </div></section>
      <TrustBar />
    </>
  );
}
