/* =========================================================================
   EKA ORGANICS — Storefront app (vanilla JS, no build step)
   Routes: #/  #/shop?stage=  #/product/:id  #/checkout  #/story  #/faq
   ========================================================================= */
(function () {
  "use strict";

  const CFG = window.EKA_CONFIG;
  const PRODUCTS = window.EKA_PRODUCTS;
  const STAGES = window.EKA_STAGES;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const pct = (v) => Math.round((1 - v.price / v.mrp) * 100);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem("eka_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("eka_" + k, JSON.stringify(v)); } catch {} },
  };

  /* ---------------------------------------------------------- Icons */
  const I = {
    leaf: '<svg viewBox="0 0 40 40"><path d="M8 32C8 16 18 8 33 7c0 16-9 25-25 25Z"/><path d="M8 32 24 16"/></svg>',
    shield: '<svg viewBox="0 0 40 40"><path d="M20 5 32 9v10c0 8-5 13-12 16C13 32 8 27 8 19V9Z"/><path d="m15 20 4 4 7-8"/></svg>',
    drop: '<svg viewBox="0 0 40 40"><path d="M20 5s10 11 10 19a10 10 0 0 1-20 0C10 16 20 5 20 5Z"/><path d="M15 25a5 5 0 0 0 5 5"/></svg>',
    heart: '<svg viewBox="0 0 40 40"><path d="M20 33S6 25 6 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 18-14 18Z"/></svg>',
    truck: '<svg viewBox="0 0 40 40"><path d="M4 11h20v16H4zM24 17h7l5 5v5H24"/><circle cx="11" cy="29" r="3"/><circle cx="30" cy="29" r="3"/></svg>',
    cod: '<svg viewBox="0 0 40 40"><rect x="5" y="11" width="30" height="18" rx="2"/><circle cx="20" cy="20" r="4"/><path d="M9 15h2M29 25h2"/></svg>',
    ret: '<svg viewBox="0 0 40 40"><path d="M10 16h18a7 7 0 0 1 0 14H14"/><path d="m15 11-5 5 5 5"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    gift: '<svg viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="16"/><path d="M3 8h26v4H3zM16 8v20M16 8c-2-5-8-5-7-1 1 2 7 1 7 1Zm0 0c2-5 8-5 7-1-1 2-7 1-7 1Z"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  const stars = (r) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
  const ratingHTML = (p) => p.reviews > 0
    ? `<div class="rating"><span class="stars">${stars(p.rating)}</span>${p.rating} (${p.reviews})</div>` : "";
  const art = (p, o) => window.productArt(p, o);

  /* ---------------------------------------------------------- Cart */
  let repaintSummary = null;
  let cart = store.get("cart", []).filter((l) => byId[l.id]);
  let coupon = store.get("coupon", null);

  function save() { store.set("cart", cart); store.set("coupon", coupon); }
  function addToCart(id, v = 0, q = 1, open = true) {
    const line = cart.find((l) => l.id === id && l.v === v);
    if (line) line.q = Math.min(10, line.q + q); else cart.push({ id, v, q });
    save(); renderCart(); bumpBadge();
    if (open) openDrawer("cart"); else toast(`${byId[id].name} added to your bag`, "View bag", () => openDrawer("cart"));
  }
  function setQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].q = Math.min(10, q); save(); renderCart(); }

  function totals() {
    let sub = 0, mrp = 0, count = 0;
    cart.forEach((l) => { const v = byId[l.id].variants[l.v]; sub += v.price * l.q; mrp += v.mrp * l.q; count += l.q; });
    let disc = 0, couponErr = "";
    if (coupon) {
      const c = CFG.coupons[coupon];
      if (!c) couponErr = "This code isn't valid.";
      else if (c.min && sub < c.min) couponErr = `Add ${inr(c.min - sub)} more to use ${coupon}.`;
      else disc = c.type === "pct" ? Math.round(sub * c.value / 100) : c.value;
    }
    const after = sub - disc;
    const ship = count === 0 || after >= CFG.freeShippingAt ? 0 : CFG.shippingFee;
    return { sub, mrp, count, disc, couponErr, ship, total: after + ship, after, gift: after >= CFG.giftAt };
  }

  function bumpBadge() {
    const b = $("#cartCount"); const t = totals();
    b.textContent = t.count; b.hidden = t.count === 0;
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }

  function meterHTML(t) {
    const max = CFG.giftAt * 1.08;
    const w = Math.min(100, (t.after / max) * 100);
    const a = (CFG.freeShippingAt / max) * 100, b = (CFG.giftAt / max) * 100;
    let msg;
    if (t.after < CFG.freeShippingAt) msg = `You're <b>${inr(CFG.freeShippingAt - t.after)}</b> away from <b>free express shipping</b>`;
    else if (t.after < CFG.giftAt) msg = `Free shipping unlocked ✓ Add <b>${inr(CFG.giftAt - t.after)}</b> for <b>2 free miniatures</b>`;
    else msg = `<b>Free shipping + 2 complimentary miniatures</b> unlocked ✓`;
    return `<div class="ship-meter"><p>${msg}</p>
      <div class="meter"><div class="meter__fill" style="width:${w}%"></div>
        <span class="meter__tick ${t.after >= CFG.freeShippingAt ? "hit" : ""}" style="left:${a}%"></span>
        <span class="meter__tick ${t.gift ? "hit" : ""}" style="left:${b}%"></span></div>
      <div class="meter__labels"><span>Bag</span><span style="margin-left:auto;margin-right:9%">Free shipping ₹${CFG.freeShippingAt}</span><span>Gift ₹${CFG.giftAt.toLocaleString("en-IN")}</span></div></div>`;
  }

  function renderCart() {
    const t = totals();
    $("#cartHeadCount").textContent = t.count ? `(${t.count})` : "";
    const body = $("#cartBody"), foot = $("#cartFoot");
    $("#cartCount").textContent = t.count; $("#cartCount").hidden = t.count === 0;
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><img src="assets/img/monogram-dark.png" alt=""/><h4>Your bag is empty</h4>
        <p>Begin with our signature Bloom Belly Oil — loved through every trimester.</p>
        <a class="btn" href="#/product/bloom-belly-oil">Shop Bloom Belly Oil</a></div>`;
      foot.innerHTML = ""; foot.hidden = true; return;
    }
    foot.hidden = false;
    const inCart = new Set(cart.map((l) => l.id));
    const ups = ["bloom-belly-oil", "malish-baby-oil", "nurture-nursing-balm", "soothe-baby-balm", "velvet-belly-butter", "baby-ubtan"].filter((id) => !inCart.has(id)).slice(0, 4);
    body.innerHTML = meterHTML(t) + cart.map((l, i) => {
      const p = byId[l.id], v = p.variants[l.v];
      return `<div class="line-item">
        <a class="thumb" href="#/product/${p.id}">${art(p)}</a>
        <div><h4>${p.name}</h4><div class="meta">${v.size}</div>
          <div><span class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.q}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></span>
          <button class="remove" data-rm="${i}">Remove</button></div></div>
        <div class="price">${inr(v.price * l.q)}${v.mrp > v.price ? `<s>${inr(v.mrp * l.q)}</s>` : ""}</div></div>`;
    }).join("") +
      (t.gift ? `<div class="gift-line">${I.gift}<span><b>2 Ayurvedic miniatures</b> will be tucked into your parcel — complimentary.</span></div>` : "") +
      (ups.length ? `<div class="upsell"><h5>Complete the ritual</h5><div class="upsell__row">${ups.map((id) => { const p = byId[id]; return `
        <div class="upsell__card"><a class="thumb" href="#/product/${id}">${art(p)}</a><b>${p.name}</b><small>${inr(p.variants[0].price)}</small><br/><button data-add="${id}">+ Add</button></div>`; }).join("")}</div></div>` : "");

    foot.innerHTML = `
      <form class="coupon" id="couponForm"><input name="c" placeholder="Coupon code" value="${coupon && !t.couponErr ? coupon : ""}" aria-label="Coupon code"/><button class="btn btn--ghost btn--sm">Apply</button></form>
      ${coupon ? `<p class="coupon-msg ${t.couponErr ? "err" : "ok"}">${t.couponErr || `${coupon} applied — ${CFG.coupons[coupon].label}. <button data-uncoupon style="text-decoration:underline">Remove</button>`}</p>` : `<p class="coupon-msg" style="color:var(--muted)">First order? Try <b>EKAFIRST10</b></p>`}
      <div class="totals">
        <div><span>Subtotal</span><span>${inr(t.sub)}</span></div>
        ${t.mrp > t.sub ? `<div class="save"><span>You save on MRP</span><span>−${inr(t.mrp - t.sub)}</span></div>` : ""}
        ${t.disc ? `<div class="save"><span>Coupon</span><span>−${inr(t.disc)}</span></div>` : ""}
        <div><span>Shipping</span><span>${t.ship ? inr(t.ship) : "Free"}</span></div>
        <div class="grand"><span>Total <small style="font-weight:300;color:var(--muted)">incl. GST</small></span><span>${inr(t.total)}</span></div>
      </div>
      <a class="btn btn--block" href="#/checkout" data-close-all>Checkout securely · ${inr(t.total)}</a>
      <p class="foot-note">UPI · Cards · NetBanking · Cash on Delivery</p>`;
  }

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"); if (q) { const i = +q.dataset.q; setQty(i, cart[i].q + +q.dataset.d); return; }
    const rm = e.target.closest("[data-rm]"); if (rm) { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); bumpBadge(); return; }
    const add = e.target.closest("[data-add]"); if (add) { e.preventDefault(); addToCart(add.dataset.add, +(add.dataset.v || 0), 1, !add.hasAttribute("data-silent")); return; }
    const qv = e.target.closest("[data-qv]"); if (qv) { e.preventDefault(); quickView(qv.dataset.qv); return; }
    if (e.target.closest("[data-uncoupon]")) { coupon = null; save(); renderCart(); return; }
    if (e.target.closest("[data-open-quiz]")) { closeDrawers(); openQuiz(); return; }
    if (e.target.closest("[data-close-all]")) { closeDrawers(); closeModal(); }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "couponForm") {
      e.preventDefault(); const c = e.target.c.value.trim().toUpperCase(); coupon = c || null; save(); renderCart();
      if (location.hash.startsWith("#/checkout") && repaintSummary) repaintSummary();
    }
    if (e.target.matches("[data-news]")) {
      e.preventDefault(); e.target.innerHTML = `<p style="padding:16px 0;color:var(--champagne);font-family:var(--serif);font-size:22px;font-style:italic">Welcome to the Eka Circle. Your code: EKAFIRST10</p>`;
    }
  });

  /* ---------------------------------------------------------- Drawers & modal */
  const scrim = $("#scrim");
  function openDrawer(which) {
    closeDrawers(true);
    const d = which === "cart" ? $("#cartDrawer") : $("#menuDrawer");
    if (which === "cart") renderCart();
    d.classList.add("open"); d.setAttribute("aria-hidden", "false"); scrim.classList.add("on");
    document.body.style.overflow = "hidden";
    setTimeout(() => d.querySelector("[data-close]")?.focus(), 50);
  }
  function closeDrawers(keepScroll) {
    $$(".drawer").forEach((d) => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); });
    scrim.classList.remove("on"); if (!keepScroll) document.body.style.overflow = "";
  }
  $("#cartOpen").onclick = () => openDrawer("cart");
  $("#menuOpen").onclick = () => openDrawer("menu");
  scrim.onclick = () => closeDrawers();
  $$(".drawer [data-close]").forEach((b) => (b.onclick = () => closeDrawers()));
  $$("#menuDrawer a").forEach((a) => a.addEventListener("click", () => closeDrawers()));

  const modal = $("#modal"), panel = $("#modalPanel");
  function openModal(html, cls = "") {
    panel.className = "modal__panel " + cls;
    panel.innerHTML = `<button class="icon-btn modal__close" aria-label="Close">${I.close}</button>` + html;
    modal.classList.add("on"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    $(".modal__close", panel).onclick = closeModal;
  }
  function closeModal() { modal.classList.remove("on"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawers(); closeSearch(); } });

  let toastT;
  function toast(msg, action, fn) {
    const t = $("#toast"); t.innerHTML = `<span>${msg}</span>` + (action ? `<button>${action}</button>` : "");
    if (action) $("button", t).onclick = () => { fn(); t.classList.remove("on"); };
    t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3600);
  }

  /* ---------------------------------------------------------- Search */
  const sBar = $("#searchBar"), sIn = $("#searchInput"), sRes = $("#searchResults");
  $("#searchOpen").onclick = () => { sBar.hidden = !sBar.hidden; if (!sBar.hidden) sIn.focus(); };
  $("#searchClose").onclick = closeSearch;
  function closeSearch() { sBar.hidden = true; sIn.value = ""; sRes.innerHTML = ""; }
  sIn.addEventListener("input", () => {
    const q = sIn.value.trim().toLowerCase();
    if (q.length < 2) { sRes.innerHTML = ""; return; }
    const hits = PRODUCTS.filter((p) => [p.name, p.sub, STAGES[p.stage].name, ...(p.concerns || []), ...p.hero.map((h) => h.name)].join(" ").toLowerCase().includes(q)).slice(0, 5);
    sRes.innerHTML = hits.length ? hits.map((p) => `<a class="sr-item" href="#/product/${p.id}"><span class="thumb">${art(p)}</span><span><b>${p.name}</b><small>${p.sub} · ${inr(p.variants[0].price)}</small></span></a>`).join("")
      : `<p style="color:var(--muted);padding:8px">No matches — try “belly”, “baby”, or “postpartum”.</p>`;
    $$("a", sRes).forEach((a) => a.addEventListener("click", closeSearch));
  });

  /* ---------------------------------------------------------- WhatsApp / email links */
  $$("[data-whatsapp]").forEach((a) => (a.href = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent("Hi Eka Organics, I'd like help choosing a ritual.")}`));
  $$("[data-email]").forEach((a) => (a.href = `mailto:${CFG.email}`));
  $("#year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- Pincode */
  const STATE_BY_PIN = [[11, 11, "Delhi"], [12, 13, "Haryana"], [14, 16, "Punjab"], [17, 17, "Himachal Pradesh"], [18, 19, "Jammu & Kashmir"], [20, 28, "Uttar Pradesh"], [30, 34, "Rajasthan"], [36, 39, "Gujarat"], [40, 44, "Maharashtra"], [45, 48, "Madhya Pradesh"], [49, 49, "Chhattisgarh"], [50, 50, "Telangana"], [51, 53, "Andhra Pradesh"], [56, 59, "Karnataka"], [60, 64, "Tamil Nadu"], [67, 69, "Kerala"], [70, 74, "West Bengal"], [75, 77, "Odisha"], [78, 78, "Assam"], [79, 79, "North East"], [80, 85, "Bihar"]];
  const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "North East", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  const METRO = { 11: "Delhi NCR", 40: "Mumbai", 56: "Bengaluru", 60: "Chennai", 70: "Kolkata", 50: "Hyderabad", 41: "Pune", 38: "Ahmedabad", 12: "Gurugram" };
  function stateFor(pin) { const d = +String(pin).slice(0, 2); const m = STATE_BY_PIN.find(([a, b]) => d >= a && d <= b); return m ? m[2] : ""; }
  function addDays(n) { const d = new Date(); let added = 0; while (added < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) added++; } return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }); }
  // Estimate only — replace with your courier's serviceability API (Shiprocket / Delhivery) before launch.
  function checkPin(pin) {
    if (!/^[1-8]\d{5}$/.test(pin)) return { ok: false };
    const d = +pin.slice(0, 2);
    const remote = [18, 19, 79].includes(d) || pin.startsWith("744");
    const metro = METRO[d];
    const [a, b] = metro ? [1, 3] : remote ? [5, 8] : [3, 6];
    return { ok: true, metro, remote, by: addDays(b), from: addDays(a), cod: !remote, place: metro || stateFor(pin) };
  }

  /* ---------------------------------------------------------- Components */
  function card(p) {
    const v = p.variants[0], off = pct(v);
    const tags = [p.tags.includes("bestseller") && '<span class="tag tag--dark">Bestseller</span>', p.tags.includes("new") && '<span class="tag">New</span>', off >= 12 && `<span class="tag tag--off">${off}% off</span>`].filter(Boolean).join("");
    return `<article class="card rv">
      <a class="card__media" href="#/product/${p.id}" aria-label="${esc(p.name)}">${art(p)}<div class="card__tags">${tags}</div></a>
      <div class="card__quick"><button class="btn" data-add="${p.id}">Add to bag · ${inr(v.price)}</button><button class="btn btn--ghost" data-qv="${p.id}" aria-label="Quick view">${I.eye}</button></div>
      <div class="card__body">
        <span class="card__stage">${STAGES[p.stage].name}</span>
        <a href="#/product/${p.id}" class="card__name">${p.name}</a>
        <p class="card__sub">${p.sub}</p>
        <div class="card__foot"><span class="price">${inr(v.price)}${v.mrp > v.price ? `<s>${inr(v.mrp)}</s><span class="off">${off}% off</span>` : ""}</span>${ratingHTML(p)}</div>
        <button class="btn btn--ghost card__mobile-add" data-add="${p.id}">Add to bag</button>
      </div></article>`;
  }

  const trustHTML = () => `<section class="trustbar"><div class="container trustbar__grid">${CFG.trust.map((t) => `<div class="trust">${I[t.icon]}<div><b>${t.title}</b><span>${t.text}</span></div></div>`).join("")}</div></section>`;

  const leafShadow = () => `<div class="leafshadow" aria-hidden="true"><svg viewBox="0 0 600 600">
    <g fill="#120c08">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${120 + i * 26}" cy="${80 + i * 34}" rx="70" ry="16" transform="rotate(${-28 + i * 3} ${120 + i * 26} ${80 + i * 34})"/><ellipse cx="${60 + i * 22}" cy="${130 + i * 40}" rx="62" ry="14" transform="rotate(${32 - i * 2} ${60 + i * 22} ${130 + i * 40})"/>`).join("")}
    <path d="M20 20 Q200 260 360 600" stroke="#120c08" stroke-width="6" fill="none"/></g></svg></div>`;

  function reveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  }

  /* ---------------------------------------------------------- Views */
  function viewHome() {
    const bloom = byId["bloom-belly-oil"], butter = byId["velvet-belly-butter"];
    const best = ["bloom-belly-oil", "sutika-postpartum-oil", "malish-baby-oil", "nine-month-ritual", "velvet-belly-butter", "nurture-nursing-balm", "first-malish-kit", "soothe-baby-balm"].map((id) => byId[id]);
    const set = byId["nine-month-ritual"];
    const setMrp = set.includes.reduce((s, id) => s + byId[id].variants[0].price, 0);
    const stageArt = { pregnancy: bloom, postpartum: byId["sutika-postpartum-oil"], baby: byId["malish-baby-oil"], sets: byId["welcome-home-hamper"] };

    return `
    <section class="hero">
      <div class="hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">— Ayurvedic care for mother &amp; child —</p>
          <h1 class="h-xl">Nurture <em>the bloom,</em><br/>cherish the beginning.</h1>
          <p class="lead">Certified-organic belly oils, postpartum rituals and gentle baby care — rooted in the wisdom of Ayurveda, made for the most tender chapters of life.</p>
          <div class="hero__ctas">
            <a class="btn btn--light" href="#/product/bloom-belly-oil">Shop Bloom Belly Oil</a>
            <button class="btn btn--outline-light" data-open-quiz>Find your ritual</button>
          </div>
          <div class="hero__proof">
            <div><b>Since 2018</b>Rooted in Ayurveda</div>
            <div><b>0%</b>Synthetic fragrance</div>
            <div><b>COD</b>Across India</div>
          </div>
        </div>
        <div class="hero__visual">
          ${leafShadow()}
          <img class="hero__mono" src="assets/img/monogram.png" alt="" />
          <div class="art" style="inset:14% 4% 2% 22%">${art(bloom, { bg: false })}</div>
          <div class="art" style="inset:44% 46% 0 -4%">${art(butter, { bg: false })}</div>
          <a class="float-card float-card--a" href="#/product/bloom-belly-oil"><div><b>Bloom Belly Oil</b>Our signature · from ${inr(bloom.variants[0].price)}</div>${I.arrow}</a>
          <div class="float-card float-card--b"><div><b>Pregnancy-safe</b>Fragrance-free · Retinoid-free</div></div>
        </div>
      </div>
    </section>
    ${trustHTML()}

    <section class="section"><div class="container">
      <div class="sec-head rv"><div><p class="eyebrow">— Shop by moment —</p><h2 class="h-lg">A ritual for <em>every chapter</em></h2></div>
        <a class="link-u" href="#/shop">View all</a></div>
      <div class="stages">${Object.entries(STAGES).map(([k, s], i) => `
        <a class="stage rv" href="#/shop?stage=${k}" style="background:${s.tone}">
          <div class="stage__art">${art(stageArt[k], { tone: s.tone, alt: i % 2 })}</div>
          <span class="arrow">${I.arrow}</span>
          <span class="stage__n">0${i + 1}</span><h3>${s.name}</h3><p>${s.line}</p></a>`).join("")}</div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container feature">
      <div class="feature__media rv">${art(bloom, { tone: "#EADFD2" })}<div class="feature__badge">Our<br/>signature<br/>blend</div></div>
      <div class="feature__copy rv">
        <p class="eyebrow">— The hero of the nine months —</p>
        <h2 class="h-lg">Bloom <em>Belly Oil</em></h2>
        <p class="lead">A cold-pressed blend of Konkan Kokum, Rosehip and sun-infused Calendula to keep growing skin supple, comfortable and deeply nourished — from the second trimester to the fourth.</p>
        <div class="ing-list">${bloom.hero.map((h) => `<div><small>${h.origin}</small><b>${h.name}</b><p>${h.note}</p></div>`).join("")}</div>
        <div class="timeline">
          <div><b>Trimester 2</b><span>Begin the ritual as your belly starts to grow</span></div>
          <div><b>Trimester 3</b><span>Twice daily, with Velvet Belly Butter at night</span></div>
          <div><b>The 4th</b><span>Continue for 3 months after birth</span></div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn" data-add="bloom-belly-oil">Add to bag · ${inr(bloom.variants[0].price)}</button>
          <a class="btn btn--ghost" href="#/product/bloom-belly-oil">Discover more</a>
        </div>
      </div>
    </div></section>

    <section class="section" style="background:var(--ivory)"><div class="container">
      <div class="sec-head rv"><div><p class="eyebrow">— Most loved —</p><h2 class="h-lg">Bestsellers</h2></div><a class="link-u" href="#/shop">Shop all</a></div>
      <div class="grid">${best.map(card).join("")}</div>
    </div></section>

    <section class="band"><div class="container band__inner">
      <img class="band__mono rv" src="assets/img/monogram.png" alt="" />
      <div class="rv"><p class="eyebrow eyebrow--light">— 60-second consultation —</p><h2 class="h-lg">Not sure where <em>to begin?</em></h2>
        <p>Tell us where you are in your journey — pregnancy, postpartum or your baby's first years — and we'll curate a ritual for you.</p></div>
      <button class="btn btn--light rv" data-open-quiz>Find your ritual</button>
    </div></section>

    <section class="section"><div class="container">
      <div class="center rv" style="margin-bottom:56px"><p class="eyebrow">— Sacred provenance —</p><h2 class="h-lg">From Indian soil, <em>with intention</em></h2>
        <p class="lead" style="margin-top:16px">Every botanical is chosen for purity, gentleness and the place it grows best — then cold-pressed or slow-infused in small batches.</p></div>
      <div class="prov">
        ${[["Kokum Butter", "Konkan Coast, Maharashtra", "Wild-harvested Garcinia seeds, pressed into a butter that softens skin without heaviness."],
           ["Virgin Coconut", "Kerala", "Cold-pressed from fresh kernels — the gentle base of our malish and nursing care."],
           ["Wood-pressed Sesame", "Tamil Nadu", "The classical base oil of Ayurvedic Abhyanga, slow-pressed to keep its warmth."],
           ["Calendula & Bala", "Himalayan foothills", "Sun-infused flowers and revered roots for comfort and restoration."]]
          .map(([n, o, t], i) => `<div class="prov__item rv"><span class="prov__num">0${i + 1}</span><h4>${n}</h4><small>${o}</small><p>${t}</p></div>`).join("")}
      </div>
    </div></section>

    <section class="section bundle"><div class="container bundle__grid">
      <div class="bundle__media rv">${art(set, { tone: "#CDBBAA" })}</div>
      <div class="rv">
        <p class="eyebrow">— The complete ritual · save ${inr(setMrp - set.variants[0].price)} —</p>
        <h2 class="h-lg" style="margin-top:12px">The Nine-Month <em>Ritual</em></h2>
        <p class="lead" style="margin-top:16px">Everything a mother-to-be needs, hand-finished in a keepsake box with a ritual card. The gift every baby shower remembers.</p>
        <div class="bundle__items">${set.includes.map((id) => { const p = byId[id]; return `<div class="bundle__item"><span class="thumb">${art(p)}</span><span><b>${p.name}</b><small>${p.variants[0].size}</small></span><span class="p">${inr(p.variants[0].price)}</span></div>`; }).join("")}</div>
        <div class="bundle__price"><b>${inr(set.variants[0].price)}</b><s>${inr(setMrp)}</s><span class="off" style="color:var(--ok);font-weight:500">Save ${Math.round((1 - set.variants[0].price / setMrp) * 100)}%</span></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn" data-add="nine-month-ritual">Add the ritual to bag</button><a class="btn btn--ghost" href="#/shop?stage=sets">All gift sets</a></div>
      </div>
    </div></section>

    <section class="section promise"><div class="container center">
      <p class="eyebrow eyebrow--light rv">— The Eka promise —</p>
      <h2 class="h-lg rv" style="margin:12px 0 18px">What we <em>leave out</em> matters most</h2>
      <p class="lead rv">When it touches a growing belly or a newborn's skin, there is no room for compromise.</p>
      <div class="freefrom rv">${[["Parabens", "Preservative-free oils"], ["Phthalates", "Never in our bottles"], ["Mineral oil", "Only plant oils"], ["Synthetic fragrance", "Unscented by design"], ["Retinoids", "Pregnancy-safe actives"], ["Sulphates", "Soap-free cleansing"], ["Silicones", "Breathable formulas"], ["Animal testing", "100% cruelty-free"]].map(([a, b]) => `<div><span>${a}</span><small>${b}</small></div>`).join("")}</div>
    </div></section>

    <section class="section"><div class="container">
      <div class="center rv" style="margin-bottom:48px"><p class="eyebrow">— From our mothers —</p><h2 class="h-lg">Words of <em>love</em></h2></div>
      <div class="reviews">${window.EKA_REVIEWS.map((r) => `<blockquote class="review rv" style="margin:0"><span class="stars">${stars(r.stars)}</span><p>${esc(r.text)}</p><footer><b>${esc(r.name)}, ${esc(r.city)}</b>on ${esc(r.product)}</footer></blockquote>`).join("")}</div>
      <p class="placeholder-note">Preview note: placeholder testimonials — replace with genuine customer reviews in assets/js/data.js before launch.</p>
    </div></section>

    <section class="split">
      <div class="split__img rv" role="img" aria-label="Eka Organics, established 2018"></div>
      <div class="split__copy rv">
        <p class="eyebrow">— Our story —</p>
        <h2 class="h-lg">Eka — <em>the one.</em></h2>
        <p class="lead">Eka means “one” in Sanskrit: one mother, one child, one unbreakable bond. We began in 2018 with a single belly oil, inspired by the malish and Sutika rituals passed down through generations of Indian women.</p>
        <p class="lead">Today, every Eka formulation is made in small batches with certified-organic botanicals — honest enough for pregnancy, gentle enough for a newborn.</p>
        <p class="sig">With love, the Eka family</p>
        <a class="btn btn--ghost" href="#/story">Read our story</a>
      </div>
    </section>

    <section class="section"><div class="container faq-wrap">
      <div class="rv"><p class="eyebrow">— Questions, answered —</p><h2 class="h-lg" style="margin-top:12px">Gentle <em>guidance</em></h2>
        <p class="lead" style="margin-top:16px">Still unsure? Our care team replies on WhatsApp within the hour, 10am–7pm IST.</p>
        <a class="btn btn--ghost" style="margin-top:26px" data-whatsapp target="_blank" rel="noopener">Ask on WhatsApp</a></div>
      <div class="acc rv">${faqHTML(window.EKA_FAQ)}</div>
    </div></section>`;
  }

  const faqHTML = (list) => list.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}</summary><div class="acc__body">${a}</div></details>`).join("");

  function viewShop(params) {
    const stage = params.get("stage") || "all";
    let sort = params.get("sort") || "featured";
    const s = STAGES[stage];
    const title = s ? s.name : "All Rituals";
    let list = PRODUCTS.filter((p) => stage === "all" || p.stage === stage);
    if (sort === "low") list = [...list].sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "high") list = [...list].sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sort === "best") list = [...list].sort((a, b) => b.tags.includes("bestseller") - a.tags.includes("bestseller"));
    const q = (o) => { const n = new URLSearchParams(params); Object.entries(o).forEach(([k, v]) => v ? n.set(k, v) : n.delete(k)); const str = n.toString(); return "#/shop" + (str ? "?" + str : ""); };
    return `
    <section class="page-hero"><div class="container">
      <div class="crumbs"><a href="#/">Home</a> / ${s ? `<a href="#/shop">Shop</a> / ${title}` : "Shop"}</div>
      <p class="eyebrow">— ${s ? s.line : "Ayurvedic care for mother & child"} —</p>
      <h1 class="h-lg">${s ? `<em>${title}</em>` : `All <em>Rituals</em>`}</h1>
    </div></section>
    <div class="container">
      <div class="toolbar">
        <div class="pills">
          <a class="pill ${stage === "all" ? "on" : ""}" href="${q({ stage: "" })}" style="display:inline-grid;place-items:center">All</a>
          ${Object.entries(STAGES).map(([k, v]) => `<a class="pill ${stage === k ? "on" : ""}" href="${q({ stage: k })}" style="display:inline-grid;place-items:center">${v.name}</a>`).join("")}
        </div>
        <div style="display:flex;gap:14px;align-items:center"><span class="count">${list.length} products</span>
          <select class="select" id="sortSel" aria-label="Sort"><option value="featured">Featured</option><option value="best">Bestsellers</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
      </div>
      <div class="grid" style="padding-bottom:100px">${list.map(card).join("")}</div>
    </div>
    ${trustHTML()}`;
  }

  function viewProduct(id) {
    const p = byId[id]; if (!p) return viewNotFound();
    const isSet = !!p.includes;
    const related = PRODUCTS.filter((x) => x.id !== id && (x.stage === p.stage || (isSet && p.includes.includes(x.id)))).slice(0, 4);
    const pairId = { "bloom-belly-oil": "velvet-belly-butter", "velvet-belly-butter": "bloom-belly-oil", "sutika-postpartum-oil": "mama-hair-elixir", "nurture-nursing-balm": "sutika-postpartum-oil", "mama-hair-elixir": "sutika-postpartum-oil", "malish-baby-oil": "soothe-baby-balm", "soothe-baby-balm": "malish-baby-oil", "baby-ubtan": "malish-baby-oil" }[id];
    const pair = pairId && byId[pairId];
    const tones = [p.art.tone, "#EADFD2", "#D9CBBE"];
    return `
    <div class="container">
      <div class="crumbs" style="padding-top:28px"><a href="#/">Home</a> / <a href="#/shop?stage=${p.stage}">${STAGES[p.stage].name}</a> / ${p.name}</div>
      <div class="pdp">
        <div class="gallery">
          <div class="gallery__thumbs">${tones.map((t, i) => `<button class="${i === 0 ? "on" : ""}" data-g="${i}" aria-label="Image ${i + 1}">${art(p, { tone: t, alt: i === 1 })}</button>`).join("")}
            <button data-g="3" aria-label="Ingredients card" style="background:var(--espresso);display:grid;place-items:center"><img src="assets/img/monogram.png" alt="" style="width:60%"/></button></div>
          <div class="gallery__main" id="gMain">${art(p)}</div>
        </div>
        <div class="info">
          <span class="card__stage">${STAGES[p.stage].name}${p.tags.includes("bestseller") ? " · Bestseller" : ""}</span>
          <h1>${p.name}</h1>
          <p class="sub">${p.sub}</p>
          ${ratingHTML(p)}
          <div class="concerns">${(p.concerns || []).map((c) => `<span>${c}</span>`).join("")}</div>
          <div class="price-row" id="priceRow" style="margin-top:22px"></div>
          ${p.variants.length > 1 ? `<div class="opt-label">Size <span id="sizeNote"></span></div><div class="sizes">${p.variants.map((v, i) => `<button class="size ${i === 0 ? "on" : ""}" data-size="${i}">${v.size}<small>${inr(v.price)}</small></button>`).join("")}</div>` : ""}
          <div class="buy-row"><span class="qty"><button id="qMinus" aria-label="Decrease">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Increase">+</button></span>
            <button class="btn" id="atc">Add to bag</button></div>
          <button class="btn btn--ghost btn--block buy-now" id="buyNow">Buy it now</button>

          <div class="offers">
            <div>${I.tag}<span>Use <b>EKAFIRST10</b> for 10% off your first order</span></div>
            <div>${I.tag}<span>Free express shipping above ₹${CFG.freeShippingAt} · <b>2 free miniatures</b> above ₹${CFG.giftAt.toLocaleString("en-IN")}</span></div>
          </div>

          <div class="pin"><div class="opt-label" style="margin-top:0">Check delivery</div>
            <form id="pinForm"><input id="pinIn" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit PIN code" aria-label="PIN code" value="${esc(store.get("pin", ""))}"/><button>Check</button></form>
            <div class="pin__out" id="pinOut"></div></div>

          <div class="mini-trust">
            <div>${I.truck}Free shipping<br/>above ₹${CFG.freeShippingAt}</div><div>${I.cod}Cash on<br/>Delivery</div><div>${I.ret}Easy 7-day<br/>returns</div><div>${I.shield}Pregnancy &amp;<br/>baby-safe</div>
          </div>

          ${pair ? `<div class="fbt"><h5>Pairs beautifully with</h5><div class="fbt__row">
            <a class="thumb" href="#/product/${p.id}">${art(p)}</a><span class="plus">+</span><a class="thumb" href="#/product/${pair.id}">${art(pair)}</a>
            <div class="fbt__info"><b>${pair.name}</b>${inr(pair.variants[0].price)} · ${pair.variants[0].size}</div>
            <button class="btn btn--sm" data-add="${pair.id}" data-silent>Add</button></div></div>` : ""}

          <div class="acc" style="margin-top:30px">
            <details open><summary>Why you'll love it</summary><div class="acc__body"><ul>${p.benefits.map((b) => `<li>${b}</li>`).join("")}</ul></div></details>
            ${isSet ? `<details open><summary>What's inside</summary><div class="acc__body"><ul>${p.includes.map((i) => `<li><a href="#/product/${i}" style="text-decoration:underline">${byId[i].name}</a> — ${byId[i].variants[0].size}</li>`).join("")}</ul></div></details>` : ""}
            ${p.hero.length ? `<details><summary>Key botanicals</summary><div class="acc__body"><ul>${p.hero.map((h) => `<li><b>${h.name}</b> (${h.origin}) — ${h.note}</li>`).join("")}</ul></div></details>` : ""}
            <details><summary>The ritual</summary><div class="acc__body">${p.ritual}</div></details>
            <details><summary>Full ingredients</summary><div class="acc__body">${p.inci}</div></details>
            <details><summary>Safety &amp; care</summary><div class="acc__body">${p.safety}</div></details>
            <details><summary>Shipping &amp; returns</summary><div class="acc__body">Dispatched within 24 hours from our studio. Metro cities 1–3 working days, rest of India 3–6. COD available on most PIN codes (₹${CFG.codFee} fee). Unopened products may be returned within 7 days.</div></details>
          </div>
        </div>
      </div>
    </div>
    <section class="section" style="background:var(--ivory)"><div class="container">
      <div class="sec-head"><div><p class="eyebrow">— Complete your ritual —</p><h2 class="h-lg">You may also <em>love</em></h2></div></div>
      <div class="grid">${related.map(card).join("")}</div></div></section>
    <div class="sticky-atc" id="stickyAtc"><span class="thumb">${art(p)}</span><div><b>${p.name}</b><small id="stickyMeta"></small></div><button class="btn" id="stickyBtn">Add to bag</button></div>`;
  }

  function mountProduct(id) {
    const p = byId[id]; if (!p) return;
    let v = 0, q = 1;
    const paint = () => {
      const x = p.variants[v];
      $("#priceRow").innerHTML = `<b>${inr(x.price)}</b>${x.mrp > x.price ? `<s>MRP ${inr(x.mrp)}</s><span class="off">${pct(x)}% off</span>` : ""}<small>Inclusive of all taxes</small>`;
      $("#qVal").textContent = q;
      $("#stickyMeta").textContent = `${x.size} · ${inr(x.price)}`;
      $("#atc").textContent = `Add to bag · ${inr(x.price * q)}`;
      const sn = $("#sizeNote"); if (sn && p.variants.length > 1) sn.textContent = v > 0 ? `Best value — ${inr(Math.round(x.price / parseFloat(x.size) * 100))} per 100` : `${x.size}`;
    };
    $$("[data-size]").forEach((b) => (b.onclick = () => { v = +b.dataset.size; $$("[data-size]").forEach((o) => o.classList.toggle("on", o === b)); paint(); }));
    $("#qMinus").onclick = () => { q = Math.max(1, q - 1); paint(); };
    $("#qPlus").onclick = () => { q = Math.min(10, q + 1); paint(); };
    $("#atc").onclick = () => addToCart(id, v, q);
    $("#stickyBtn").onclick = () => addToCart(id, v, q);
    $("#buyNow").onclick = () => { addToCart(id, v, q, false); location.hash = "#/checkout"; };

    $$("[data-g]").forEach((b) => (b.onclick = () => {
      $$("[data-g]").forEach((o) => o.classList.toggle("on", o === b));
      const g = +b.dataset.g, tones = [p.art.tone, "#EADFD2", "#D9CBBE"];
      $("#gMain").innerHTML = g < 3 ? art(p, { tone: tones[g], alt: g === 1 })
        : `<div class="gallery__info"><div><img src="assets/img/monogram.png" alt=""/><h4>${p.hero[0] ? p.hero.map((h) => h.name).slice(0, 3).join(" · ") : "A curated ritual"}</h4><p>${p.safety}</p></div></div>`;
    }));

    const pinOut = $("#pinOut");
    const doPin = (pin) => {
      const r = checkPin(pin);
      if (!r.ok) { pinOut.innerHTML = `<span class="err">Please enter a valid 6-digit PIN code.</span>`; return; }
      store.set("pin", pin);
      pinOut.innerHTML = `<span class="ok">✓ Delivery to ${pin}${r.place ? ` (${r.place})` : ""} by <b>${r.by}</b></span>
        <span>${r.cod ? "✓ Cash on Delivery available" : "Prepaid orders only for this PIN code"} · Free shipping above ₹${CFG.freeShippingAt}</span>`;
    };
    $("#pinForm").onsubmit = (e) => { e.preventDefault(); doPin($("#pinIn").value.trim()); };
    $("#pinIn").oninput = (e) => { e.target.value = e.target.value.replace(/\D/g, ""); if (e.target.value.length === 6) doPin(e.target.value); };
    if (store.get("pin", "")) doPin(store.get("pin", ""));

    const sticky = $("#stickyAtc");
    const io = new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; sticky.classList.toggle("on", on); document.body.classList.toggle("has-sticky", on); });
    io.observe($("#atc"));
    cleanup.push(() => { io.disconnect(); document.body.classList.remove("has-sticky"); });
    paint();
  }

  function viewCheckout() {
    if (!cart.length) return `<div class="empty" style="padding:120px 20px"><img src="assets/img/monogram-dark.png" alt=""/><h4>Your bag is empty</h4><p>Add a ritual to begin checkout.</p><a class="btn" href="#/shop">Continue shopping</a></div>`;
    const t = totals(); const saved = store.get("addr", {});
    const f = (name, label, attrs = "", cls = "") => `<div class="field ${cls}"><input id="f_${name}" name="${name}" placeholder=" " value="${esc(saved[name] || "")}" ${attrs}/><label for="f_${name}">${label}</label><div class="hint"></div></div>`;
    return `
    <div class="checkout">
      <div class="co-main">
        <div class="steps"><a href="#/shop">Bag</a> › <span class="on">Details &amp; Payment</span> › <span>Confirmation</span></div>
        <p class="kicker" style="margin-bottom:12px">Express checkout</p>
        <div class="express"><button type="button" data-express="upi">UPI</button><button type="button" data-express="gpay">GPay</button><button type="button" data-express="phonepe">PhonePe</button></div>
        <div class="or">or pay below</div>
        <form id="coForm" novalidate>
          <div class="fieldset"><h3>Contact</h3><div class="fields">
            ${f("phone", "Mobile number (10 digits)", 'inputmode="numeric" maxlength="10" autocomplete="tel-national" required')}
            ${f("email", "Email", 'type="email" autocomplete="email" required')}
          </div><label class="checkline"><input type="checkbox" checked/> Send order updates on WhatsApp</label></div>

          <div class="fieldset"><h3>Delivery address</h3><div class="fields">
            ${f("name", "Full name", 'autocomplete="name" required', "full")}
            ${f("addr1", "Flat, house no., building", 'autocomplete="address-line1" required', "full")}
            ${f("addr2", "Area, street, landmark", 'autocomplete="address-line2"', "full")}
            ${f("pin", "PIN code", 'inputmode="numeric" maxlength="6" autocomplete="postal-code" required')}
            ${f("city", "City", 'autocomplete="address-level2" required')}
            <div class="field full"><select id="f_state" name="state" required><option value="">Select</option>${STATES.map((s) => `<option ${saved.state === s ? "selected" : ""}>${s}</option>`).join("")}</select><label for="f_state">State</label><div class="hint"></div></div>
          </div><p id="coPin" class="checkline" style="margin-top:12px"></p></div>

          <div class="fieldset"><h3>Payment</h3>
            <div class="pay">
              <div class="pay__opt on"><label><input type="radio" name="pay" value="upi" checked/> UPI <small>GPay · PhonePe · Paytm · BHIM</small></label>
                <div class="pay__body">Pay instantly with any UPI app — you'll approve the request on your phone.<div class="upi-apps"><span>Google Pay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div></div></div>
              <div class="pay__opt"><label><input type="radio" name="pay" value="card"/> Credit / Debit card <small>Visa · Mastercard · RuPay</small></label>
                <div class="pay__body">You'll enter card details on our secure payment partner's page. EMI available above ₹3,000.</div></div>
              <div class="pay__opt"><label><input type="radio" name="pay" value="nb"/> NetBanking &amp; Wallets <small>All major banks</small></label>
                <div class="pay__body">Choose your bank on the next screen.</div></div>
              <div class="pay__opt" id="codOpt"><label><input type="radio" name="pay" value="cod"/> Cash on Delivery <small>+${inr(CFG.codFee)}</small></label>
                <div class="pay__body">Pay in cash or UPI when your parcel arrives. Save ${inr(CFG.codFee)} by paying online now.</div></div>
            </div>
          </div>
          <button class="btn btn--block" id="placeBtn" style="height:58px">Place order</button>
          <p class="secure">${I.lock} 256-bit SSL encrypted · Your details are never stored on our servers</p>
          <p class="placeholder-note">Preview mode — payments are simulated. Connect Razorpay / Cashfree / Shopify Payments before launch.</p>
        </form>
      </div>
      <aside class="co-side"><div class="co-side__inner" id="coSummary"></div></aside>
    </div>`;
  }

  function coSummaryHTML(pay) {
    const t = totals(); const cod = pay === "cod" ? CFG.codFee : 0;
    return `<h3 style="font-size:28px;margin-bottom:22px">Order summary</h3>
      <div class="co-items">${cart.map((l) => { const p = byId[l.id], v = p.variants[l.v]; return `<div class="co-item"><span class="thumb">${art(p)}<i>${l.q}</i></span><span><b>${p.name}</b><small>${v.size}</small></span><span class="p">${inr(v.price * l.q)}</span></div>`; }).join("")}
      ${t.gift ? `<div class="co-item"><span class="thumb" style="display:grid;place-items:center;background:var(--cream)">${I.gift.replace("<svg", '<svg width="28" style="fill:none;stroke:var(--taupe);stroke-width:1.3"')}</span><span><b>2 Ayurvedic miniatures</b><small>Complimentary gift</small></span><span class="p">Free</span></div>` : ""}</div>
      <form class="coupon" id="couponForm"><input name="c" placeholder="Coupon code" value="${coupon && !t.couponErr ? coupon : ""}" aria-label="Coupon code"/><button class="btn btn--ghost btn--sm">Apply</button></form>
      ${coupon ? `<p class="coupon-msg ${t.couponErr ? "err" : "ok"}">${t.couponErr || `${coupon} applied ✓`}</p>` : ""}
      <div class="totals">
        <div><span>Subtotal</span><span>${inr(t.sub)}</span></div>
        ${t.disc ? `<div class="save"><span>Coupon (${coupon})</span><span>−${inr(t.disc)}</span></div>` : ""}
        <div><span>Shipping</span><span>${t.ship ? inr(t.ship) : "Free"}</span></div>
        ${cod ? `<div><span>COD handling</span><span>${inr(cod)}</span></div>` : ""}
        <div class="grand"><span>Total</span><span>${inr(t.total + cod)}</span></div>
        ${t.mrp - t.sub + t.disc > 0 ? `<div class="save" style="justify-content:flex-end;font-size:12.5px">You're saving ${inr(t.mrp - t.sub + t.disc)} on this order</div>` : ""}
      </div>
      ${t.after < CFG.freeShippingAt ? `<p class="coupon-msg" style="margin-top:10px">Add ${inr(CFG.freeShippingAt - t.after)} more for free shipping. <a href="#/shop" style="text-decoration:underline">Continue shopping</a></p>` : ""}
      <div class="mini-trust" style="margin-top:28px"><div>${I.truck}Dispatched<br/>in 24 hrs</div><div>${I.ret}Easy 7-day<br/>returns</div><div>${I.leaf}Certified<br/>organic</div><div>${I.lock.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" style="stroke-width:1"')}Secure<br/>payments</div></div>`;
  }

  function mountCheckout() {
    if (!cart.length) return;
    const form = $("#coForm"); let pay = "upi";
    const paintSum = () => ($("#coSummary").innerHTML = coSummaryHTML(pay));
    paintSum(); repaintSummary = paintSum; cleanup.push(() => (repaintSummary = null));
    $$('input[name="pay"]').forEach((r) => r.addEventListener("change", () => {
      pay = r.value; $$(".pay__opt").forEach((o) => o.classList.toggle("on", o.contains(r))); paintSum();
    }));
    $$("[data-express]").forEach((b) => (b.onclick = () => { $('input[value="upi"]').click(); $("#f_phone").focus(); toast("Fill your delivery details — UPI is selected"); }));
    const pinIn = $("#f_pin"), coPin = $("#coPin");
    const onPin = () => {
      pinIn.value = pinIn.value.replace(/\D/g, "");
      if (pinIn.value.length !== 6) { coPin.textContent = ""; return; }
      const r = checkPin(pinIn.value);
      if (!r.ok) { coPin.innerHTML = `<span style="color:var(--danger)">That PIN code doesn't look right.</span>`; return; }
      const st = stateFor(pinIn.value); if (st && !$("#f_state").value) $("#f_state").value = st;
      if (r.metro && !$("#f_city").value) { $("#f_city").value = r.metro.replace(" NCR", ""); }
      coPin.innerHTML = `${I.truck.replace("<svg", '<svg width="20" style="fill:none;stroke:var(--taupe);stroke-width:1.4"')} Estimated delivery by <b style="color:var(--ink);margin-left:4px">${r.by}</b>`;
      const codOpt = $("#codOpt"); codOpt.style.opacity = r.cod ? 1 : .45; $("input", codOpt).disabled = !r.cod;
      if (!r.cod && pay === "cod") { $('input[value="upi"]').click(); }
    };
    pinIn.addEventListener("input", onPin); onPin();
    $("#f_phone").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));

    const rules = {
      phone: (v) => /^[6-9]\d{9}$/.test(v) || "Enter a valid 10-digit mobile number",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email",
      name: (v) => v.trim().length > 1 || "Please enter your name",
      addr1: (v) => v.trim().length > 3 || "Please enter your address",
      pin: (v) => checkPin(v).ok || "Enter a valid 6-digit PIN code",
      city: (v) => v.trim().length > 1 || "Please enter your city",
      state: (v) => !!v || "Please select your state",
    };
    form.onsubmit = (e) => {
      e.preventDefault(); let first = null; const data = {};
      Object.entries(rules).forEach(([k, fn]) => {
        const el = form.elements[k]; data[k] = el.value; const res = fn(el.value); const wrap = el.closest(".field");
        wrap.classList.toggle("err", res !== true); $(".hint", wrap).textContent = res === true ? "" : res;
        if (res !== true && !first) first = el;
      });
      data.addr2 = form.elements.addr2.value;
      if (first) { first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
      store.set("addr", data);
      const btn = $("#placeBtn"); btn.disabled = true; btn.textContent = pay === "cod" ? "Confirming your order…" : "Connecting to secure payment…";
      setTimeout(() => {
        const t = totals(); const cod = pay === "cod" ? CFG.codFee : 0;
        const order = { id: "EKA" + Date.now().toString().slice(-7), total: t.total + cod, pay, name: data.name, phone: data.phone, city: data.city, by: checkPin(data.pin).by, items: cart.reduce((s, l) => s + l.q, 0) };
        store.set("lastOrder", order); cart = []; coupon = null; save(); renderCart();
        location.hash = "#/success";
      }, 1400);
    };
  }

  function viewSuccess() {
    const o = store.get("lastOrder", null);
    if (!o) return viewNotFound();
    const payName = { upi: "UPI", card: "Card", nb: "NetBanking", cod: "Cash on Delivery" }[o.pay];
    return `<div class="success">
      <img src="assets/img/monogram-dark.png" alt=""/>
      <p class="eyebrow">— Thank you, ${esc(o.name.split(" ")[0])} —</p>
      <h1 class="h-lg">Your ritual is <em>on its way</em></h1>
      <p class="lead" style="margin:0 auto">We've sent your confirmation to WhatsApp (+91 ${esc(o.phone)}). Your parcel will be hand-packed and dispatched within 24 hours.</p>
      <div class="card-o"><div><span>Order</span><b>#${o.id}</b></div><div><span>Items</span><span>${o.items}</span></div><div><span>Payment</span><span>${payName}</span></div><div><span>Delivering to</span><span>${esc(o.city)}</span></div><div><span>Expected by</span><b>${o.by}</b></div><div style="border-top:1px solid var(--line);padding-top:10px"><span>Total</span><b>${inr(o.total)}</b></div></div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn" href="#/shop">Continue shopping</a><a class="btn btn--ghost" data-whatsapp target="_blank" rel="noopener" href="https://wa.me/${CFG.whatsapp}">Track on WhatsApp</a></div>
      <p class="placeholder-note">Preview mode — no real order was placed or payment taken.</p>
    </div>`;
  }

  function viewStory() {
    return `
    <section class="split" style="min-height:70vh">
      <div class="split__img"></div>
      <div class="split__copy">
        <p class="eyebrow">— estd 2018 —</p>
        <h1 class="h-lg">Eka — <em>the one.</em></h1>
        <p class="lead">In Sanskrit, <i>eka</i> means one. One mother. One child. One bond that begins long before the first heartbeat is heard.</p>
        <p class="lead">Eka Organics was born from the rituals of Indian motherhood — the daily malish, the warm oils of the Sutika period, the ubtan our grandmothers mixed by hand — and from a simple question: why should the products we use in these tender moments contain anything we can't pronounce?</p>
      </div>
    </section>
    <section class="section"><div class="container">
      <div class="center" style="margin-bottom:56px"><p class="eyebrow">— How we make —</p><h2 class="h-lg">Slow, small, <em>sincere</em></h2></div>
      <div class="prov">${[["Sourced with care", "Organic farms across India", "We work with growers we know by name — Kokum from the Konkan, coconut from Kerala, sesame from Tamil Nadu."], ["Pressed, not processed", "Cold & wood-pressed", "Our oils are never heat-refined or bleached, so they keep the nutrients nature gave them."], ["Formulated for two", "Pregnancy & baby-safe", "Every formula is free from retinoids, essential oils, synthetic fragrance and harsh preservatives."], ["Made in small batches", "Hand-filled in India", "Fresh batches, batch-coded and dated, so you always know exactly what you're using."]].map(([n, o, t], i) => `<div class="prov__item rv"><span class="prov__num">0${i + 1}</span><h4>${n}</h4><small>${o}</small><p>${t}</p></div>`).join("")}</div>
    </div></section>
    <section class="band"><div class="container band__inner"><img class="band__mono" src="assets/img/monogram.png" alt=""/><div><h2 class="h-lg">Begin your <em>ritual</em></h2><p>Find the formulations made for where you are today.</p></div><a class="btn btn--light" href="#/shop">Shop all</a></div></section>
    ${trustHTML()}`;
  }

  function viewFaq() {
    return `<section class="page-hero"><div class="container"><div class="crumbs"><a href="#/">Home</a> / FAQs</div><p class="eyebrow">— We're here to help —</p><h1 class="h-lg">Frequently <em>asked</em></h1></div></section>
      <section class="section"><div class="container" style="max-width:860px"><div class="acc">${faqHTML(window.EKA_FAQ)}</div>
      <div class="center" style="margin-top:48px"><a class="btn" data-whatsapp target="_blank" rel="noopener" href="https://wa.me/${CFG.whatsapp}">Chat with our care team</a></div></div></section>`;
  }

  const viewNotFound = () => `<div class="empty" style="padding:140px 20px"><img src="assets/img/monogram-dark.png" alt=""/><h4>This page has wandered off</h4><p>Let's get you back to something lovely.</p><a class="btn" href="#/">Return home</a></div>`;

  /* ---------------------------------------------------------- Quick view */
  function quickView(id) {
    const p = byId[id], v = p.variants[0];
    openModal(`<div class="qv"><div class="qv__media">${art(p)}</div><div class="qv__info">
      <span class="card__stage">${STAGES[p.stage].name}</span><h3>${p.name}</h3><p class="sub" style="color:var(--muted)">${p.sub}</p>
      <div class="price-row" style="display:flex;gap:10px;align-items:baseline;margin:18px 0"><b style="font-family:var(--serif);font-size:30px;font-weight:500">${inr(v.price)}</b>${v.mrp > v.price ? `<s style="color:var(--muted)">${inr(v.mrp)}</s><span style="color:var(--ok);font-size:13px">${pct(v)}% off</span>` : ""}</div>
      <ul style="padding-left:18px;color:var(--muted);font-size:14px;margin:0 0 24px">${p.benefits.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}</ul>
      ${p.variants.length > 1 ? `<div class="sizes" style="margin-bottom:16px">${p.variants.map((x, i) => `<button class="size ${i === 0 ? "on" : ""}" data-qvs="${i}">${x.size}<small>${inr(x.price)}</small></button>`).join("")}</div>` : ""}
      <button class="btn btn--block" id="qvAdd" data-close-all>Add to bag</button>
      <a class="link-u" href="#/product/${p.id}" data-close-all>View full details</a></div></div>`);
    let sel = 0;
    $$("[data-qvs]", panel).forEach((b) => (b.onclick = () => { sel = +b.dataset.qvs; $$("[data-qvs]", panel).forEach((o) => o.classList.toggle("on", o === b)); }));
    $("#qvAdd").onclick = () => { closeModal(); addToCart(id, sel); };
  }

  /* ---------------------------------------------------------- Ritual quiz */
  const QUIZ = [
    { q: "Where are you in your journey?", key: "stage", opts: [
      ["preg1", "Expecting · First trimester", "Weeks 1–12"], ["preg2", "Expecting · 2nd or 3rd trimester", "Weeks 13–40"],
      ["post", "Newly postpartum", "The first 3 months"], ["baby", "Caring for my little one", "Newborn to 3 years"]] },
    { q: "What would you most like support with?", key: "need", dyn: true },
    { q: "Is this for you, or a gift?", key: "gift", opts: [["me", "For me", "Building my own ritual"], ["gift", "A gift", "Baby shower or new-mother gift"]] },
  ];
  const NEEDS = {
    preg1: [["prevent", "Preparing skin early", "Gentle, daily nourishment"], ["dry", "Dry, itchy skin", "Comfort for changing skin"]],
    preg2: [["marks", "Stretch-mark care", "Elasticity & suppleness"], ["dry", "Tight, itchy belly", "Deep overnight comfort"]],
    post: [["recovery", "Body recovery & aches", "Traditional Sutika care"], ["hair", "Postpartum hair fall", "Scalp nourishment"], ["nursing", "Nursing comfort", "Sore, dry skin"], ["marks", "Fading stretch marks", "Continued belly care"]],
    baby: [["malish", "Daily malish", "Massage & bonding"], ["nappy", "Nappy area & dry patches", "Calm, protected skin"], ["bath", "Gentle, soap-free bath", "For 6 months+"]],
  };
  const REC = {
    prevent: ["bloom-belly-oil"], dry: ["velvet-belly-butter", "bloom-belly-oil"], marks: ["bloom-belly-oil", "velvet-belly-butter"],
    recovery: ["sutika-postpartum-oil", "nurture-nursing-balm"], hair: ["mama-hair-elixir", "sutika-postpartum-oil"], nursing: ["nurture-nursing-balm", "sutika-postpartum-oil"],
    malish: ["malish-baby-oil", "soothe-baby-balm"], nappy: ["soothe-baby-balm", "malish-baby-oil"], bath: ["baby-ubtan", "malish-baby-oil"],
  };
  const GIFT = { preg1: "nine-month-ritual", preg2: "nine-month-ritual", post: "welcome-home-hamper", baby: "first-malish-kit" };

  function openQuiz() {
    const ans = {}; let step = 0;
    const paint = () => {
      if (step >= QUIZ.length) return result();
      const s = QUIZ[step]; const opts = s.dyn ? NEEDS[ans.stage] : s.opts;
      $("#quizBody").innerHTML = `<div class="quiz__top"><span class="kicker">Step ${step + 1} of ${QUIZ.length}</span><span class="quiz__bar"><i style="width:${((step + 1) / QUIZ.length) * 100}%"></i></span></div>
        <p class="eyebrow">— Find your ritual —</p><h3>${s.q}</h3>
        <div class="quiz__opts">${opts.map(([k, a, b]) => `<button class="quiz__opt" data-a="${k}"><b>${a}</b><span>${b}</span></button>`).join("")}</div>
        ${step ? `<button class="quiz__back" id="qBack">← Back</button>` : ""}`;
      $$("[data-a]", panel).forEach((b) => (b.onclick = () => { ans[s.key] = b.dataset.a; step++; paint(); }));
      const back = $("#qBack"); if (back) back.onclick = () => { step--; paint(); };
    };
    const result = () => {
      let ids = REC[ans.need] || ["bloom-belly-oil"];
      if (ans.gift === "gift") ids = [GIFT[ans.stage], ids[0]];
      const ps = ids.map((i) => byId[i]);
      const total = ps.reduce((s, p) => s + p.variants[0].price, 0);
      $("#quizBody").innerHTML = `<p class="eyebrow">— Your Eka ritual —</p><h3>Curated <em style="color:var(--taupe)">for you</em></h3>
        <div class="quiz__result">${ps.map((p) => `<div class="card"><a class="card__media" href="#/product/${p.id}" data-close-all>${art(p)}</a><div class="card__body"><span class="card__name">${p.name}</span><span class="card__sub">${p.sub}</span><span class="price">${inr(p.variants[0].price)}</span></div></div>`).join("")}</div>
        <button class="btn" id="qAddAll">Add ritual to bag · ${inr(total)}</button>
        <button class="quiz__back" id="qRestart">↺ Start again</button>`;
      $("#qAddAll").onclick = () => { closeModal(); ids.forEach((i, n) => addToCart(i, 0, 1, n === ids.length - 1)); };
      $("#qRestart").onclick = () => { step = 0; paint(); };
    };
    openModal(`<div class="quiz" id="quizBody"></div>`);
    paint();
  }

  /* ---------------------------------------------------------- Welcome popup */
  function maybePopup() {
    if (store.get("popSeen", false)) return;
    setTimeout(() => {
      if (modal.classList.contains("on") || location.hash.startsWith("#/checkout") || $(".drawer.open")) return;
      store.set("popSeen", true);
      openModal(`<div class="pop"><div class="pop__media"></div><div class="pop__copy">
        <p class="eyebrow">— Welcome to Eka —</p><h3 class="h-md">Enjoy <b>10% off</b> your first ritual</h3>
        <p style="color:var(--muted)">Join the Eka Circle for trimester guides, postpartum wisdom and early access to new rituals.</p>
        <form id="popForm"><input type="email" required placeholder="Your email address" aria-label="Email"/><button class="btn">Unlock 10% off</button></form>
        <button class="no" data-close-all>No thanks</button></div></div>`);
      $("#popForm").onsubmit = (e) => { e.preventDefault(); e.target.outerHTML = `<div class="code-box">EKAFIRST10</div><p style="font-size:13px;color:var(--muted);margin-top:10px;text-align:center">Applied to your bag automatically.</p>`; coupon = "EKAFIRST10"; save(); renderCart(); };
    }, 14000);
  }

  /* ---------------------------------------------------------- Router */
  let cleanup = [];
  function route() {
    cleanup.forEach((fn) => fn()); cleanup = [];
    const hash = location.hash.slice(1) || "/";
    const [path, qs] = hash.split("?");
    const params = new URLSearchParams(qs || "");
    const main = $("#main");
    const parts = path.split("/").filter(Boolean);
    let html, mount, title = "Eka Organics — Ayurvedic Rituals for Mother & Baby";
    switch (parts[0]) {
      case undefined: html = viewHome(); break;
      case "shop": html = viewShop(params); mount = () => { const s = $("#sortSel"); s.value = params.get("sort") || "featured"; s.onchange = () => { params.set("sort", s.value); location.hash = "#/shop?" + params.toString(); }; }; title = `${STAGES[params.get("stage")]?.name || "Shop All"} — Eka Organics`; break;
      case "product": html = viewProduct(parts[1]); mount = () => mountProduct(parts[1]); title = `${byId[parts[1]]?.name || "Product"} — Eka Organics`; break;
      case "checkout": html = viewCheckout(); mount = mountCheckout; title = "Checkout — Eka Organics"; break;
      case "success": html = viewSuccess(); title = "Thank you — Eka Organics"; break;
      case "story": html = viewStory(); title = "Our Story — Eka Organics"; break;
      case "faq": html = viewFaq(); title = "FAQs — Eka Organics"; break;
      default: html = viewNotFound();
    }
    main.innerHTML = html; document.title = title;
    document.body.classList.toggle("is-checkout", parts[0] === "checkout");
    $$(".nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + hash));
    if (mount) mount();
    reveal();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  window.addEventListener("hashchange", route);

  /* ---------------------------------------------------------- Boot */
  const ann = $$("#announceTrack span"); let ai = 0; ann[0].classList.add("on");
  setInterval(() => { ann[ai].classList.remove("on"); ai = (ai + 1) % ann.length; ann[ai].classList.add("on"); }, 4200);
  const header = $("#header");
  addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 30), { passive: true });

  renderCart(); bumpBadge(); route(); maybePopup();
})();
