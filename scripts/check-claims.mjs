#!/usr/bin/env node
/* =========================================================================
   Claims guardrail — runs before every build (`npm run check:claims`).

   Cosmetics in India may only claim to cleanse, beautify, promote
   attractiveness or alter appearance (Drugs & Cosmetics Act / CDSCO).
   Any wording that implies treating the body is blocked here.

   Prefer: nourish, soften, condition, soothe, calm the senses,
           support a ritual, care for skin.
   ========================================================================= */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["src"];
const EXT = /\.(tsx?|mdx?|json)$/;

/** [pattern, what to use instead] */
const BANNED = [
  [/\bcur(e|es|ed|ing)\b/i, "nourish / care for skin"],
  [/\btreat(s|ed|ing|ment|ments)?\b/i, "care for / condition"],
  [/\bheal(s|ed|ing)?\b/i, "soothe / comfort"],
  [/hormon/i, "remove — no hormonal claims"],
  [/regulat\w*\s+(your\s+)?(menstrual\s+)?(periods?|cycles?)/i, "remove — no menstrual claims"],
  [/metabolism/i, "remove — no metabolic claims"],
  [/burn(s|ing)?\s+fat|fat[\s-]*burn|weight[\s-]*loss|lose\s+weight|slimming/i, "remove — no weight claims"],
  [/detox/i, "remove — no detox claims"],
  [/acidity/i, "remove — no digestive claims"],
  [/bloat/i, "remove — no digestive claims"],
  [/(improv\w*|better|deeper|promot\w*|induc\w*|aid\w*)\s+(your\s+)?sleep|sleep\s+better|insomnia/i, "support a calming nightly ritual"],
  [/\brelie(f|ve|ves|ved|ving)\b/i, "soothe / comfort"],
  [/\bitch(y|ing|iness)?\b/i, "dry, tight-feeling skin"],
  [/\brash(es)?\b/i, "dry, delicate skin"],
  [/inflammat/i, "soothe"],
  [/stretch[\s-]*marks?/i, "a growing belly / supple skin"],
  [/hair[\s-]*(fall|loss)/i, "scalp & hair care"],
  [/\banti[\s-]?(aging|ageing|bacterial|fungal|inflammatory|septic)\b/i, "describe the cosmetic effect instead"],
  [/\b(clinically\s+proven|guaranteed\s+results?)\b/i, "only with evidence on file"],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const [re, use] of BANNED) {
        const m = line.match(re);
        if (m) hits.push(`  ${relative(ROOT, file)}:${i + 1}  “${m[0]}”  → use: ${use}`);
      }
    });
  }
}

if (hits.length) {
  console.error(`\n✗ Claims guardrail: ${hits.length} non-cosmetic claim(s) found\n\n${hits.join("\n")}\n`);
  process.exit(1);
}
console.log("✓ Claims guardrail: no non-cosmetic claims found");
