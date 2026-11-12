/* SVG packaging illustrations — placeholders until product photography is ready.
   To switch to photos: render <Image src={`/products/${p.id}.jpg`} fill /> here instead. */
import type { Product } from "@/lib/data";

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

type A = Product["art"];
const SERIF = "var(--font-serif), Cormorant Garamond, serif";
const SANS = "var(--font-sans), Jost, sans-serif";
const INK = "#3D2F26";

function Label({ x, y, w, h, a }: { x: number; y: number; w: number; h: number; a: A }) {
  const cx = x + w / 2;
  const lw = Math.min(w * 0.62, 70);
  const lh = lw * 0.655;
  const base = y + h * 0.1 + lh;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#FBF8F3" />
      <image href="/img/wordmark-dark.png" x={cx - lw / 2} y={y + h * 0.1} width={lw} height={lh} />
      <line x1={cx - 16} x2={cx + 16} y1={base + 7} y2={base + 7} stroke={INK} strokeOpacity={0.35} strokeWidth={0.6} />
      <text x={cx} y={base + 22} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={Math.max(11, w / 7.2)} fill={INK}>{a.short}</text>
      <text x={cx} y={base + 34} textAnchor="middle" fontFamily={SANS} fontSize={5.6} letterSpacing={1.6} fill={INK} fillOpacity={0.7}>{a.kind.toUpperCase()}</text>
    </g>
  );
}

function Shape({ a, id }: { a: A; id: string }) {
  const glass = `url(#g-${id})`, sheen = `url(#m-${id})`, shadow = `url(#s-${id})`;
  switch (a.type) {
    case "dropper":
      return (<>
        <ellipse cx={150} cy={326} rx={78} ry={9} fill={shadow} />
        <rect x={137} y={46} width={26} height={54} rx={13} fill={a.cap} />
        <rect x={141} y={52} width={5} height={40} rx={2.5} fill="#fff" opacity={0.12} />
        <rect x={124} y={98} width={52} height={30} rx={3} fill="#C9B39B" />
        <rect x={124} y={98} width={52} height={30} rx={3} fill={sheen} />
        <path d="M108 140 Q108 128 122 128 H178 Q192 128 192 140 L196 160 V310 Q196 322 184 322 H116 Q104 322 104 310 V160 Z" fill={glass} />
        <rect x={112} y={150} width={9} height={160} rx={4.5} fill="#fff" opacity={0.18} />
        <Label x={118} y={186} w={64} h={112} a={a} />
      </>);
    case "pump":
      return (<>
        <ellipse cx={150} cy={326} rx={80} ry={9} fill={shadow} />
        <path d="M140 52 H188 Q196 52 196 60 V66 H150 V82 H140 Z" fill={a.cap} />
        <rect x={138} y={80} width={24} height={32} rx={3} fill={a.cap} />
        <rect x={128} y={108} width={44} height={22} rx={4} fill={INK} />
        <path d="M106 146 Q106 130 124 130 H176 Q194 130 194 146 V310 Q194 322 182 322 H118 Q106 322 106 310 Z" fill={glass} />
        <rect x={113} y={148} width={9} height={160} rx={4.5} fill="#fff" opacity={0.18} />
        <Label x={118} y={184} w={64} h={112} a={a} />
      </>);
    case "bottle":
      return (<>
        <ellipse cx={150} cy={326} rx={78} ry={9} fill={shadow} />
        <rect x={128} y={62} width={44} height={54} rx={6} fill={a.cap} />
        <rect x={132} y={66} width={6} height={44} rx={3} fill="#fff" opacity={0.14} />
        <path d="M110 140 Q110 116 134 116 H166 Q190 116 190 140 V310 Q190 322 178 322 H122 Q110 322 110 310 Z" fill={glass} stroke="rgba(61,47,38,.12)" />
        <rect x={116} y={138} width={8} height={170} rx={4} fill="#fff" opacity={0.4} />
        <Label x={122} y={180} w={56} h={116} a={a} />
      </>);
    case "jar":
      return (<>
        <ellipse cx={150} cy={326} rx={98} ry={10} fill={shadow} />
        <rect x={76} y={150} width={148} height={44} rx={8} fill={a.cap} />
        <rect x={76} y={150} width={148} height={44} rx={8} fill={sheen} />
        <path d="M80 196 H220 V306 Q220 322 204 322 H96 Q80 322 80 306 Z" fill={glass} stroke="rgba(61,47,38,.12)" />
        <rect x={88} y={202} width={10} height={110} rx={5} fill="#fff" opacity={0.35} />
        <Label x={114} y={206} w={72} h={104} a={a} />
      </>);
    case "tin":
      return (<>
        <ellipse cx={150} cy={326} rx={96} ry={10} fill={shadow} />
        <rect x={64} y={246} width={172} height={74} rx={10} fill={a.cap} />
        <rect x={64} y={230} width={172} height={30} rx={10} fill="#B39C84" />
        <ellipse cx={150} cy={230} rx={86} ry={22} fill="#D8C6B2" />
        <ellipse cx={150} cy={230} rx={86} ry={22} fill={sheen} />
        <image href="/img/wordmark-dark.png" x={124} y={214} width={52} height={34} />
        <text x={150} y={294} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={16} fill={INK}>{a.short}</text>
        <text x={150} y={306} textAnchor="middle" fontFamily={SANS} fontSize={5.6} letterSpacing={1.6} fill={INK} fillOpacity={0.7}>{a.kind.toUpperCase()}</text>
      </>);
    case "tube":
      return (<>
        <ellipse cx={150} cy={326} rx={70} ry={8} fill={shadow} />
        <rect x={124} y={270} width={52} height={52} rx={6} fill={a.cap} />
        <path d="M108 52 H192 L186 272 H114 Z" fill={glass} stroke="rgba(61,47,38,.12)" />
        <rect x={106} y={46} width={88} height={10} rx={2} fill={a.glass} stroke="rgba(61,47,38,.18)" />
        <rect x={116} y={62} width={8} height={200} rx={4} fill="#fff" opacity={0.35} />
        <Label x={122} y={104} w={56} h={118} a={a} />
      </>);
    case "box": {
      const dark = lum(a.glass) < 0.5;
      return (<>
        <ellipse cx={150} cy={326} rx={118} ry={11} fill={shadow} />
        <rect x={46} y={130} width={208} height={192} rx={4} fill={a.glass} />
        <rect x={46} y={130} width={208} height={192} rx={4} fill={sheen} opacity={0.6} />
        <rect x={40} y={112} width={220} height={34} rx={3} fill={a.glass} stroke="rgba(0,0,0,.12)" />
        <rect x={140} y={112} width={20} height={210} fill={a.cap} opacity={0.9} />
        <path d="M150 112 C128 84 98 88 112 108 C118 116 140 114 150 112 Z M150 112 C172 84 202 88 188 108 C182 116 160 114 150 112 Z" fill={a.cap} />
        <circle cx={150} cy={112} r={7} fill={a.cap} />
        <rect x={84} y={196} width={132} height={96} rx={2} fill={dark ? "#EADFD2" : "#FBF8F3"} />
        <rect x={89} y={201} width={122} height={86} rx={1} fill="none" stroke={INK} strokeOpacity={0.25} strokeWidth={0.7} />
        <image href="/img/wordmark-dark.png" x={128} y={208} width={44} height={29} />
        <text x={150} y={261} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={16} fill={INK}>{a.short}</text>
        <text x={150} y={275} textAnchor="middle" fontFamily={SANS} fontSize={5.6} letterSpacing={1.8} fill={INK} fillOpacity={0.75}>{a.kind.toUpperCase()}</text>
      </>);
    }
  }
}

export default function ProductArt({ p, tone, alt, bg = true }: { p: Product; tone?: string; alt?: boolean; bg?: boolean }) {
  const a = p.art;
  const id = p.id; // gradients depend only on the product, so shared ids are identical and safe
  return (
    <svg viewBox="0 0 300 360" style={{ overflow: "hidden" }} role="img" aria-label={p.name} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={a.glass} stopOpacity={0.95} />
          <stop offset=".18" stopColor={a.glass} stopOpacity={0.78} />
          <stop offset=".55" stopColor={a.glass} />
          <stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id={`m-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset=".5" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`s-${id}`}>
          <stop offset="0" stopColor="#2a1f18" stopOpacity={0.35} />
          <stop offset="1" stopColor="#2a1f18" stopOpacity={0} />
        </radialGradient>
      </defs>
      {bg && (<>
        <rect width={300} height={360} fill={tone || a.tone} />
        <circle cx={alt ? 70 : 236} cy={alt ? 300 : 70} r={alt ? 120 : 90} fill="#fff" opacity={0.22} />
      </>)}
      <Shape a={a} id={id} />
    </svg>
  );
}
