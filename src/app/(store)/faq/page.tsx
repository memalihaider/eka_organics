import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, whatsappUrl } from "@/lib/data";
import { FaqList } from "@/components/Sections";

export const metadata: Metadata = { title: "FAQs", description: "Pregnancy safety, delivery times, Cash on Delivery and returns — your questions about Eka Organics answered." };

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero"><div className="container">
        <div className="crumbs"><Link href="/">Home</Link> / FAQs</div>
        <p className="eyebrow">— We&apos;re here to help —</p>
        <h1 className="h-lg">Frequently <em>asked</em></h1>
      </div></section>
      <section className="section"><div className="container" style={{ maxWidth: 860 }}>
        <div className="acc"><FaqList items={FAQ} /></div>
        <div className="center" style={{ marginTop: 48 }}><a className="btn" href={whatsappUrl()} target="_blank" rel="noopener">Chat with our care team</a></div>
      </div></section>
    </>
  );
}
