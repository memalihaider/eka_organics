import Image from "next/image";
import Link from "next/link";
import { CONFIG, whatsappUrl } from "@/lib/data";
import { WhatsApp } from "../Icons";
import { QuizButton } from "../store/Buttons";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer__news">
          <div>
            <p className="eyebrow eyebrow--light">— The Eka Circle —</p>
            <h3>Gentle rituals, delivered to your inbox</h3>
            <p>Our Ritual Guide, seasonal practices from Ayurvedic tradition, and complimentary shipping on your first order.</p>
          </div>
          <NewsletterForm />
        </div>
        <div className="footer__grid">
          <div className="footer__brand">
            <Image src="/img/wordmark-light.png" alt="eka organics" width={591} height={387} style={{ height: "auto" }} />
            <p>Traditional inspiration, modern formulation, transparent ingredients — Ayurvedic rituals for every chapter of a woman&apos;s life.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link href="/products/nabhi-ritual-oil">Nabhi Ritual Oil</Link>
            <Link href="/products/nabhi-kund-oil">Nabhi Kund Oil</Link>
            <Link href="/shop?stage=midlife">Women 40+</Link>
            <Link href="/shop?stage=body">Body Care</Link>
            <Link href="/shop?stage=pregnancy">Pregnancy</Link>
            <Link href="/shop?stage=postpartum">Postpartum</Link>
            <Link href="/shop?stage=baby">Baby &amp; Little Ones</Link>
            <Link href="/shop?stage=sets">Gift Sets</Link>
          </div>
          <div>
            <h4>Eka</h4>
            <Link href="/story">Our Story</Link>
            <Link href="/story">Ingredients &amp; Sourcing</Link>
            <QuizButton>Find Your Ritual</QuizButton>
            <Link href="/faq">FAQs</Link>
          </div>
          <div>
            <h4>Care</h4>
            <Link href="/faq">Shipping &amp; Delivery</Link>
            <Link href="/faq">Returns &amp; Refunds</Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener">WhatsApp Support</a>
            <a href={`mailto:${CONFIG.email}`}>Email Us</a>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} Eka Organics · estd 2018 · Made with care in India</span>
          <span aria-label="Accepted payments">UPI · Cards · NetBanking · Wallets · COD</span>
        </div>
      </footer>
      <a className="wa-float" href={whatsappUrl()} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"><WhatsApp /></a>
    </>
  );
}
