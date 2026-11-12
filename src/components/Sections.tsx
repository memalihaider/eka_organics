/* Small shared server-rendered sections */
import { PROOF_POINTS, type StageKey } from "@/lib/data";
import { TRUST_ICONS } from "./Icons";

/** Proof points — only claims flagged as verified in data.ts (CLAIMS) appear. */
export function TrustBar() {
  return (
    <section className="trustbar">
      <div className="container trustbar__grid">
        {PROOF_POINTS.map((t) => {
          const Icon = TRUST_ICONS[t.icon];
          return <div className="trust" key={t.title}><Icon /><div><b>{t.title}</b><span>{t.text}</span></div></div>;
        })}
      </div>
    </section>
  );
}

export function FaqList({ items }: { items: [string, string][] }) {
  return (
    <>
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0}><summary>{q}</summary><div className="acc__body">{a}</div></details>
      ))}
    </>
  );
}

export function LeafShadow() {
  return (
    <div className="leafshadow" aria-hidden="true">
      <svg viewBox="0 0 600 600">
        <g fill="#120c08">
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <ellipse cx={120 + i * 26} cy={80 + i * 34} rx={70} ry={16} transform={`rotate(${-28 + i * 3} ${120 + i * 26} ${80 + i * 34})`} />
              <ellipse cx={60 + i * 22} cy={130 + i * 40} rx={62} ry={14} transform={`rotate(${32 - i * 2} ${60 + i * 22} ${130 + i * 40})`} />
            </g>
          ))}
          <path d="M20 20 Q200 260 360 600" stroke="#120c08" strokeWidth={6} fill="none" />
        </g>
      </svg>
    </div>
  );
}

export const stageHref = (k?: StageKey) => (k ? `/shop?stage=${k}` : "/shop");
