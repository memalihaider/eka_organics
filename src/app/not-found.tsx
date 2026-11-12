import Image from "next/image";
import Link from "next/link";
import StoreLayout from "./(store)/layout";

export default function NotFound() {
  return (
    <StoreLayout>
    <div className="empty" style={{ padding: "140px 20px" }}>
      <Image src="/img/monogram-dark.png" alt="" width={220} height={200} />
      <h4>This page has wandered off</h4>
      <p>Let&apos;s get you back to something lovely.</p>
      <Link className="btn" href="/">Return home</Link>
    </div>
    </StoreLayout>
  );
}
