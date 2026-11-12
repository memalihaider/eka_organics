"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  if (done) {
    return <p style={{ padding: "16px 0", color: "var(--champagne)", fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic" }}>Welcome to the Eka Circle. Use WELCOME for complimentary shipping.</p>;
  }
  return (
    // TODO: send the email to your ESP (Klaviyo / Mailchimp) via a route handler
    <form className="news-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <input type="email" required placeholder="Your email address" aria-label="Email address" />
      <button className="btn btn--light">Join</button>
    </form>
  );
}
