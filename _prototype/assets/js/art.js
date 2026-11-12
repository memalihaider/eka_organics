/* Eka Organics — SVG packaging illustrations.
   Placeholder art until product photography is ready: swap productArt()
   output for an <img> per product when you have real photos. */
(function () {
  let uid = 0;
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  };

  function label(x, y, w, h, a, dark) {
    const ink = dark ? "#F5EFE7" : "#3D2F26";
    const logo = dark ? "assets/img/wordmark-light.png" : "assets/img/wordmark-dark.png";
    const cx = x + w / 2;
    const lw = Math.min(w * 0.62, 70);
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${dark ? "rgba(255,255,255,.04)" : "#FBF8F3"}" ${dark ? `stroke="rgba(234,223,210,.35)" stroke-width=".8"` : ""}/>
      <image href="${logo}" x="${cx - lw / 2}" y="${y + h * 0.1}" width="${lw}" height="${lw * 0.655}" />
      <line x1="${cx - 16}" x2="${cx + 16}" y1="${y + h * 0.1 + lw * 0.655 + 7}" y2="${y + h * 0.1 + lw * 0.655 + 7}" stroke="${ink}" stroke-opacity=".35" stroke-width=".6"/>
      <text x="${cx}" y="${y + h * 0.1 + lw * 0.655 + 22}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="${Math.max(11, w / 7.2)}" fill="${ink}">${a.short}</text>
      <text x="${cx}" y="${y + h * 0.1 + lw * 0.655 + 34}" text-anchor="middle" font-family="Jost, sans-serif" font-size="5.6" letter-spacing="1.6" fill="${ink}" fill-opacity=".7">${a.kind.toUpperCase()}</text>`;
  }

  function glassDefs(id, c) {
    return `
      <linearGradient id="g${id}" x1="0" x2="1">
        <stop offset="0" stop-color="${c}" stop-opacity=".95"/>
        <stop offset=".18" stop-color="${c}" stop-opacity=".78"/>
        <stop offset=".55" stop-color="${c}"/>
        <stop offset="1" stop-color="#000" stop-opacity=".35"/>
      </linearGradient>
      <linearGradient id="m${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".22"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="s${id}"><stop offset="0" stop-color="#2a1f18" stop-opacity=".35"/><stop offset="1" stop-color="#2a1f18" stop-opacity="0"/></radialGradient>`;
  }

  const shapes = {
    dropper(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="78" ry="9" fill="url(#s${id})"/>
        <rect x="137" y="46" width="26" height="54" rx="13" fill="${a.cap}"/>
        <rect x="141" y="52" width="5" height="40" rx="2.5" fill="#fff" opacity=".12"/>
        <rect x="124" y="98" width="52" height="30" rx="3" fill="#C9B39B"/>
        <rect x="124" y="98" width="52" height="30" rx="3" fill="url(#m${id})"/>
        <path d="M108 140 Q108 128 122 128 H178 Q192 128 192 140 L196 160 V310 Q196 322 184 322 H116 Q104 322 104 310 V160 Z" fill="url(#g${id})"/>
        <rect x="112" y="150" width="9" height="160" rx="4.5" fill="#fff" opacity=".18"/>
        ${label(118, 186, 64, 112, a, lum(a.glass) < 0.5 ? false : false)}`;
    },
    pump(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="80" ry="9" fill="url(#s${id})"/>
        <path d="M140 52 H188 Q196 52 196 60 V66 H150 V82 H140 Z" fill="${a.cap}"/>
        <rect x="138" y="80" width="24" height="32" rx="3" fill="${a.cap}"/>
        <rect x="128" y="108" width="44" height="22" rx="4" fill="#3D2F26"/>
        <path d="M106 146 Q106 130 124 130 H176 Q194 130 194 146 V310 Q194 322 182 322 H118 Q106 322 106 310 Z" fill="url(#g${id})"/>
        <rect x="113" y="148" width="9" height="160" rx="4.5" fill="#fff" opacity=".18"/>
        ${label(118, 184, 64, 112, a, false)}`;
    },
    bottle(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="78" ry="9" fill="url(#s${id})"/>
        <rect x="128" y="62" width="44" height="54" rx="6" fill="${a.cap}"/>
        <rect x="132" y="66" width="6" height="44" rx="3" fill="#fff" opacity=".14"/>
        <path d="M110 140 Q110 116 134 116 H166 Q190 116 190 140 V310 Q190 322 178 322 H122 Q110 322 110 310 Z" fill="url(#g${id})" stroke="rgba(61,47,38,.12)"/>
        <rect x="116" y="138" width="8" height="170" rx="4" fill="#fff" opacity=".4"/>
        ${label(122, 180, 56, 116, a, false)}`;
    },
    jar(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="98" ry="10" fill="url(#s${id})"/>
        <rect x="76" y="150" width="148" height="44" rx="8" fill="${a.cap}"/>
        <rect x="76" y="150" width="148" height="44" rx="8" fill="url(#m${id})"/>
        <path d="M80 196 H220 V306 Q220 322 204 322 H96 Q80 322 80 306 Z" fill="url(#g${id})" stroke="rgba(61,47,38,.12)"/>
        <rect x="88" y="202" width="10" height="110" rx="5" fill="#fff" opacity=".35"/>
        ${label(114, 206, 72, 104, a, false)}`;
    },
    tin(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="96" ry="10" fill="url(#s${id})"/>
        <rect x="64" y="246" width="172" height="74" rx="10" fill="${a.cap}"/>
        <rect x="64" y="230" width="172" height="30" rx="10" fill="#B39C84"/>
        <ellipse cx="150" cy="230" rx="86" ry="22" fill="#D8C6B2"/>
        <ellipse cx="150" cy="230" rx="86" ry="22" fill="url(#m${id})"/>
        <image href="assets/img/wordmark-dark.png" x="124" y="214" width="52" height="34"/>
        <text x="150" y="294" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="16" fill="#3D2F26">${a.short}</text>
        <text x="150" y="306" text-anchor="middle" font-family="Jost, sans-serif" font-size="5.6" letter-spacing="1.6" fill="#3D2F26" fill-opacity=".7">${a.kind.toUpperCase()}</text>`;
    },
    tube(a, id) {
      return `
        <ellipse cx="150" cy="326" rx="70" ry="8" fill="url(#s${id})"/>
        <rect x="124" y="270" width="52" height="52" rx="6" fill="${a.cap}"/>
        <path d="M108 52 H192 L186 272 H114 Z" fill="url(#g${id})" stroke="rgba(61,47,38,.12)"/>
        <rect x="106" y="46" width="88" height="10" rx="2" fill="${a.glass}" stroke="rgba(61,47,38,.18)"/>
        <rect x="116" y="62" width="8" height="200" rx="4" fill="#fff" opacity=".35"/>
        ${label(122, 104, 56, 118, a, false)}`;
    },
    box(a, id) {
      const dark = lum(a.glass) < 0.5;
      return `
        <ellipse cx="150" cy="326" rx="118" ry="11" fill="url(#s${id})"/>
        <rect x="46" y="130" width="208" height="192" rx="4" fill="${a.glass}"/>
        <rect x="46" y="130" width="208" height="192" rx="4" fill="url(#m${id})" opacity=".6"/>
        <rect x="40" y="112" width="220" height="34" rx="3" fill="${a.glass}" stroke="rgba(0,0,0,.12)"/>
        <rect x="140" y="112" width="20" height="210" fill="${a.cap}" opacity=".9"/>
        <path d="M150 112 C128 84 98 88 112 108 C118 116 140 114 150 112 Z M150 112 C172 84 202 88 188 108 C182 116 160 114 150 112 Z" fill="${a.cap}"/>
        <circle cx="150" cy="112" r="7" fill="${a.cap}"/>
        <rect x="84" y="196" width="132" height="96" rx="2" fill="${dark ? "#EADFD2" : "#FBF8F3"}"/>
        <rect x="89" y="201" width="122" height="86" rx="1" fill="none" stroke="#3D2F26" stroke-opacity=".25" stroke-width=".7"/>
        <image href="assets/img/wordmark-dark.png" x="128" y="208" width="44" height="29"/>
        <text x="150" y="261" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="16" fill="#3D2F26">${a.short}</text>
        <text x="150" y="275" text-anchor="middle" font-family="Jost, sans-serif" font-size="5.6" letter-spacing="1.8" fill="#3D2F26" fill-opacity=".75">${a.kind.toUpperCase()}</text>`;
    },
  };

  window.productArt = function (p, opts = {}) {
    const a = p.art; const id = ++uid;
    const bg = opts.bg === false ? "" : `<rect width="300" height="360" fill="${opts.tone || a.tone}"/>
      <circle cx="${opts.alt ? 70 : 236}" cy="${opts.alt ? 300 : 70}" r="${opts.alt ? 120 : 90}" fill="#fff" opacity=".22"/>`;
    return `<svg viewBox="0 0 300 360" style="overflow:hidden" role="img" aria-label="${p.name}" preserveAspectRatio="xMidYMid ${opts.slice ? "slice" : "meet"}">
      <defs>${glassDefs(id, a.glass)}</defs>${bg}${shapes[a.type](a, id)}</svg>`;
  };
})();
