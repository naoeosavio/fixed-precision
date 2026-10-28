// Self-check for the static site. It loads the browser bundle, both locale
// files and index.html, then asserts that the wiring is complete.
//
// Usage: node docs/self-check.mjs

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const app = readFileSync(join(ROOT, "assets/app.js"), "utf8");

function load_locale(file) {
  const context = { window: {} };
  vm.runInNewContext(readFileSync(join(ROOT, "assets", file), "utf8"),
    context, { filename: file });
  return context.window.FP_I18N;
}

function load_bundle() {
  const context = { console };
  vm.createContext(context);
  vm.runInContext(
    readFileSync(join(ROOT, "assets/fixed-precision.js"), "utf8"),
    context, { filename: "fixed-precision.js" },
  );
  assert.ok(context.FixedPrecisionLib, "bundle global is missing");
  return context.FixedPrecisionLib.default;
}

function keys_from(source, attribute) {
  const pattern = new RegExp(attribute + '="([^"]+)"', "g");
  return new Set(Array.from(source.matchAll(pattern), (match) => match[1]));
}

const pt = load_locale("i18n.pt.js").pt;
const en = load_locale("i18n.en.js").en;
const FP = load_bundle();

assert.equal(new FP("0.1").add("0.2").toString(), "0.3");
assert.equal(new FP("1").div("3").toString(), "0.33333333");
assert.equal(new FP(123n).toString(), "0.00000123");
assert.equal(FP.PI().toString(), "3.14159265");
assert.equal(FP.create({ places: 2 })("19.99").mul("3").toString(), "59.97");

const P20 = FP.create({ places: 20, roundingMode: 4 });
const expected = ["2.68", "2.67", "2.68", "2.67", "2.68",
  "2.67", "2.68", "2.68", "2.67"];
for (let mode = 0; mode < 9; mode += 1) {
  assert.equal(P20("2.675").scale(2, mode).toFixed(2), expected[mode],
    "mode " + mode + " differs from the page table");
}
assert.equal(P20("1.005").scale(2, 6).toFixed(2), "1.00");
assert.equal(Number("2.675").toFixed(2), "2.67");

const pt_keys = Object.keys(pt).sort();
const en_keys = Object.keys(en).sort();
assert.deepEqual(en_keys, pt_keys, "locale key sets differ");

const html_keys = keys_from(html, "data-i18n");
const aria_keys = keys_from(html, "data-i18n-aria");
const checked_keys = new Set([...html_keys, ...aria_keys]);
const tr_keys = new Set(Array.from(app.matchAll(/tr\("([^"]+)"\)/g),
  (match) => match[1]));
for (const key of [...checked_keys, ...tr_keys]) {
  assert.ok(key in pt, "missing pt key: " + key);
  assert.ok(key in en, "missing en key: " + key);
}

const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g),
  (match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "duplicate id in index.html");
const used_ids = Array.from(app.matchAll(/by_id\("([^"]+)"\)/g),
  (match) => match[1]);
for (const id of used_ids) {
  assert.ok(ids.includes(id), "app.js uses a missing id: " + id);
}

const refs = Array.from(
  html.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g),
  (match) => match[1],
);
for (const ref of refs) {
  assert.ok(existsSync(join(ROOT, "assets", ref)),
    "missing asset: " + ref);
}

console.log("fixed-precision site self-check");
console.log("  bundle: 16 arithmetic checks passed");
console.log("  i18n: " + pt_keys.length + " keys per locale");
console.log("  html: " + html_keys.size + " text keys, " +
  aria_keys.size + " aria keys, " + ids.length + " ids");
console.log("  assets: " + refs.length + " references resolved");
console.log("ok");
