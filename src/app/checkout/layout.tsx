import Image from "next/image";
import Link from "next/link";
import { Lock } from "@/components/Icons";

/* Distraction-free checkout: no nav, footer or popups. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="header scrolled">
        <div className="header__inner">
          <div className="header__left"><Link href="/shop" className="nav-link" style={{ fontSize: 11 }}>← Continue shopping</Link></div>
          <Link href="/" className="logo" aria-label="Eka Organics home">
            <Image src="/img/wordmark-dark.png" alt="eka organics" width={591} height={387} priority />
          </Link>
          <div className="header__right" style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", gap: 8, color: "var(--muted)" }}>
            <Lock width={16} height={16} style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.5 }} /> <span className="hide-sm">Secure checkout</span>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>{children}</main>
    </>
  );
}
