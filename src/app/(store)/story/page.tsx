import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrustBar } from "@/components/Sections";
import { CLAIMS } from "@/lib/data";

export const metadata: Metadata = { title: "Our Story", description: "Eka means one — one mother, one child, one bond. The story behind Eka Organics, est. 2018." };

const STEPS = [
  ["Traditional inspiration", "Rooted in Ayurveda", "Nabhi abhyanga, malish, Sutika care — rituals practised by Indian women for generations, kept simple and true."],
  ["Modern formulation", "Gentle by design", `Low-fragrance botanical bases with no added camphor or mineral oil${CLAIMS.dermatologistTested ? ", dermatologist-tested with a patch-test protocol" : ""}.`],
  ["Transparent ingredients", "Fully disclosed", "Short ingredient lists with every botanical named and its origin shared — nothing hidden behind “fragrance”."],
  ["Made in small batches", "Hand-filled in India", "Batch-coded and dated, in amber glass with a recyclable outer carton."],
];

export default function Story() {
  return (
    <>
      <section className="split" style={{ minHeight: "70vh" }}>
        <div className="split__img" />
        <div className="split__copy">
          <p className="eyebrow">— estd 2018 —</p>
          <h1 className="h-lg">Eka — <em>the one.</em></h1>
          <p className="lead">In Sanskrit, <i>eka</i> means one — one woman, through every chapter of her life.</p>
          <p className="lead">Eka Organics was born from the rituals passed between generations of Indian women — the daily malish, the warm oils of the Sutika period, the quiet evening nabhi massage — and from a simple belief: the products we use in these moments should be gentle, honest, and fully disclosed.</p>
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
