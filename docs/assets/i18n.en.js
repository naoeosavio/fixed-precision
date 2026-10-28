window.FP_I18N = window.FP_I18N || {};

window.FP_I18N.en = {
  "meta.title": "fixed-precision — exact totals, no float",
  "meta.desc": "Fixed-point decimal with bigint: 0 to 20 places, nine " +
    "rounding modes and an immutable context. Two APIs, zero runtime " +
    "dependencies.",

  "skip": "skip to the content",
  "nav.aria": "main navigation",
  "nav.why": "why",
  "nav.lab": "rounding",
  "nav.features": "features",
  "nav.fns": "functional",
  "nav.core": "core",
  "nav.install": "install",

  "ui.copy": "copy",
  "ui.copied": "copied",
  "ui.copyfail": "failed",
  "ui.copycmd": "copy command",
  "ui.copycode": "copy code",

  "hero.eyebrow": "<b>//</b> fixed-point decimal · bigint · two APIs",
  "hero.h1a": "EXACT TOTALS,",
  "hero.h1b": 'no <em class="serif">float</em>.',
  "hero.sub": "Each decimal is a <b>scaled bigint</b>: 0 to 20 places, " +
    "nine rounding modes and an immutable context. No " +
    "<code>0.30000000000000004</code> on the way — and no runtime " +
    "dependency.",
  "hero.l1": "view the code ↗",
  "hero.l2": "try the rounding ↓",
  "hero.l3": "functional API ↘",
  "hero.l4": "install ↘",
  "hero.m2": "zero dependencies",
  "hero.m3": "8 default places",
  "hero.m4": "9 modes",
  "hero.m6": "119 subpaths",

  "term.title": "node — fixed-precision",
  "term.replay": "↻ replay",
  "term.aria": "example session",
  "term.meta": "local · Money = create({ places: 2 })",
  "noscript.term": "Enable JavaScript to see the animated session and the " +
    "lab. The rest of the page works without it.",

  "mq": "0.1 + 0.2 = 0.3 <i>·</i> 0–20 PLACES <i>·</i> 9 MODES <i>·</i> " +
    "SCALED BIGINT <i>·</i> ZERO DEPS <i>·</i> ESM + CJS <i>·</i> MIT " +
    "<i>·</i> TREE-SHAKEABLE <i>·</i> 119 SUBPATHS <i>·</i> ",

  "why.label": "<b>§ 01</b> — why",
  "why.h2": 'Float lies in <em class="serif">silence.</em>',
  "diff.bar": "flow — before / after",
  "why.i1.h3": "0.1 + 0.2 = <em>0.3</em>",
  "why.i1.p": "In binary, 0.1 and 0.2 have no finite representation. " +
    "FixedPrecision adds scaled integers: at 8 places, <code>1.23</code> " +
    "becomes <code>123000000</code>. The result is the number that you " +
    "wrote.",
  "why.i2.h3": "explicit <em>context</em>",
  "why.i2.p": "Places and rounding mode are part of the value. " +
    "<code>create({ places: 2 })</code> freezes an immutable context. The " +
    "class API refuses mixed precisions; the functional API resolves to the " +
    "highest <code>places</code>.",
  "why.i3.h3": "one core, <em>two APIs</em>",
  "why.i3.p": "<code>fixed-precision</code> for chaining and classes. " +
    "<code>fixed-precision-fns</code> for pure functions, with one subpath " +
    "per operation. Both use the same value-level code.",

  "steps.label": "<b>§ 02</b> — first steps",
  "steps.h2": 'Three steps to <em class="serif">close the books.</em>',
  "step1.h3": "Install",
  "step1.p": "One package, no runtime dependencies. The functional API is a " +
    "second, optional package.",
  "step2.h3": "Freeze a context",
  "step2.p": "For money, use an immutable factory: two places and the mode " +
    "that you pick. The default is <code>places: 8</code> and " +
    "<code>HALF_UP</code>.",
  "step3.h3": "Operate",
  "step3.p": "Methods accept <code>string</code>, <code>number</code>, " +
    "<code>bigint</code> or another instance. Chain without instantiating " +
    "each operand.",

  "features.label": "<b>§ 03</b> — features",
  "features.h2": 'Built like a <em class="serif">precision tool.</em>',
  "f1.k": "places 0–20",
  "f1": "The scale is explicit and bounded. " +
    "<code>new FixedPrecision(\"1.23\")</code> stores <code>123000000</code> " +
    "at 8 places; <code>create({ places: 2 })</code> stores <code>123</code>.",
  "f2.k": "9 modes",
  "f2": "<code>ROUND_UP</code>, <code>ROUND_DOWN</code>, " +
    "<code>ROUND_CEIL</code>, <code>ROUND_FLOOR</code>, " +
    "<code>ROUND_HALF_UP</code>, <code>ROUND_HALF_DOWN</code>, " +
    "<code>ROUND_HALF_EVEN</code>, <code>ROUND_HALF_CEIL</code> and " +
    "<code>ROUND_HALF_FLOOR</code>. The default is <code>HALF_UP</code> (4).",
  "f3": "Immutable factories: " +
    "<code>create({ places: 2, roundingMode: 6 })</code> freezes the " +
    "context. A later change to the global default does not change the " +
    "factory.",
  "f4": "The slim entry: creation, arithmetic, comparison, rounding, " +
    "<code>sqrt</code>, basic statistics and common formatting. " +
    "Trigonometry, logs, matrices, fractions, bitwise and combinatorics stay " +
    "out.",
  "f5": "One subpath per operation in <code>fixed-precision-fns</code>. " +
    "<code>import { add } from \"fixed-precision-fns/add\"</code> keeps only " +
    "the <code>add</code> graph: 3.06 kB minified and 1.24 kB gzip.",
  "f6": "<code>pipe</code>, <code>compose</code> and <code>partial</code> " +
    "compose typed stages end to end. The <code>*By</code> variants do the " +
    "same bind with a proper name.",
  "f7": "Scaled operations (<code>add</code>, <code>mul</code>) validate the " +
    "context. The raw operations (<code>plus</code>, <code>times</code>) " +
    "work directly on the bigint. Use raw when you know the scale.",
  "f8": "The internal value is a bigint. <code>raw()</code> returns the " +
    "scaled integer. A bigint input is treated as already scaled — see the " +
    "warning in § 06.",
  "f9": "<code>sin</code>, <code>cos</code>, <code>tan</code>, " +
    "<code>sec</code>, <code>csc</code>, <code>cot</code>, the inverse, " +
    "hyperbolic and inverse hyperbolic functions, with <code>atan2</code>. " +
    "The precision is measured against 45-digit references.",
  "f10": "No runtime dependency. ESM + CJS + TypeScript types, " +
    "<code>sideEffects: false</code> and minified builds.",
  "f11.k": "immutable",
  "f11": "Every operation returns a new value. Instances do not change; " +
    "context and scale are part of the value.",
  "f12": "MIT license on both packages. Embed it in a closed product, with " +
    "no fee and no catch.",

  "lab.label": "<b>§ 04</b> — lab",
  "lab.h2": 'Nine modes, <em class="serif">one result.</em>',
  "lab.lead": "Enter a value and pick the places. The table runs the real " +
    "<code>fixed-precision</code> build in this tab, with bigint and no " +
    "network call.",
  "lab.title": "live rounding",
  "lab.status": "local · bigint",
  "lab.value": "value",
  "lab.places": "places",
  "lab.presets": "example values",
  "lab.caption": "The result of each rounding mode for the chosen value and " +
    "places.",
  "lab.mode": "mode",
  "lab.code": "code",
  "lab.result": "result",
  "lab.inside": "inside",
  "lab.raw": "bigint (20 places)",
  "lab.scale": "scale",
  "lab.floatnote": "The <code>Number</code> decides in binary before it " +
    "rounds. Binary does not store most decimals exactly, so the result can " +
    "be different. The library decides in decimal.",
  "lab.note": "The bigint shown uses 20 places so that no digit is lost " +
    "before rounding (<code>P20</code>). The table result is " +
    "<code>scale(places, mode)</code> followed by " +
    "<code>toFixed(places)</code>.",
  "lab.invalid": "Invalid value. Use a decimal such as <code>2.675</code> " +
    "(no exponent).",
  "lab.unavailable": "The local library build did not load. Check " +
    "<code>docs/assets/fixed-precision.js</code>.",

  "mode.up": "away from zero",
  "mode.down": "toward zero",
  "mode.ceil": "toward +∞",
  "mode.floor": "toward −∞",
  "mode.halfup": "half away from zero",
  "mode.halfdown": "half toward zero",
  "mode.halfeven": "half to even",
  "mode.halfceil": "half toward +∞",
  "mode.halffloor": "half toward −∞",

  "fns.label": "<b>§ 05</b> — functional",
  "fns.h2": 'One function, <em class="serif">one subpath.</em>',
  "fns.alt": "or <code>npm add fixed-precision-fns</code> — the functional " +
    "layer is a separate package, with no runtime dependencies.",
  "fns.groups.h": "119 subpaths",
  "fns.groups": "<code>arithmetic</code> · <code>relational</code> · " +
    "<code>trigonometry</code> · <code>strings</code> · <code>logic</code> · " +
    "<code>combinatorics</code> · <code>statistics</code> · " +
    "<code>matrix</code> · <code>fractions</code> · <code>bitwise</code> · " +
    "<code>constants</code> · <code>composition</code>",
  "fns.k1.h3": "no configure()",
  "fns.k1.p": "The functional API has no mutable global state. The default " +
    "context is frozen at 8 places and HALF_UP; the context comes from the " +
    "operands, not from the environment.",
  "fns.k2.h3": "data, not classes",
  "fns.k2.p": "Value operations return plain data — <code>{ ctx, value }" +
    "</code> or a primitive. No prototype, global cache or import order. The " +
    "bridge to the class API is <code>dataOf</code>.",
  "fns.k3.h3": "measured tree-shaking",
  "fns.k3.p": "One entry per operation and <code>sideEffects: false</code>. " +
    "The barrel prunes as well: <code>import { add }</code> stays at 3.06 kB " +
    "min / 1.24 kB gzip. The budget is a CI test.",

  "core.label": "<b>§ 06</b> — core",
  "core.h2": 'The value is an <em class="serif">integer.</em>',
  "core.lead": "At 8 places, <code>1.23</code> is <code>123000000n</code>. " +
    "Addition is integer addition; division scales back. No binary mantissa.",
  "core.card1.h3": "scale",
  "core.card1.p": "<code>places</code> defines the scale, from 0 to 20. " +
    "<code>SCALE = 10^places</code>. The raw value is always a bigint.",
  "core.card2.h3": "context",
  "core.card2.p": "<code>{ places, roundingMode, SCALE, SCALENUMBER }" +
    "</code>. The context travels with the value; factories freeze it.",
  "core.card3.h3": "scaled × raw",
  "core.card3.p": "<code>add</code>/<code>mul</code> validate and scale. " +
    "<code>plus</code>/<code>times</code> skip validation and work on the " +
    "integer. Choose raw only when you know the scale.",
  "core.warn.h": "bigint is pre-scaled",
  "core.warn.p": "<code>new FixedPrecision(123n)</code> is not " +
    "<code>123</code>. At 8 places, it is <code>0.00000123</code>. Use " +
    "<code>string</code> or <code>number</code> for literal values; reserve " +
    "bigint for values that are already scaled.",
  "core.warn.link": "read the full warning ↗",

  "precision.label": "<b>§ 07</b> — precision",
  "precision.h2": 'Measured, not <em class="serif">promised.</em>',
  "precision.th1": "case",
  "precision.th2": "measure",
  "precision.r1.k": "trigonometry · generic angles",
  "precision.r1.v": "≤ 2 ULP · 7/16/18 places",
  "precision.r2.k": "tan/cot/sec/csc · reflex quadrants",
  "precision.r2.v": "≤ 15 ULP",
  "precision.r3.k": "reference for comparison",
  "precision.r3.v": "45 digits · Python Decimal",
  "precision.r4.k": "add via barrel · esbuild min",
  "precision.r4.v": "3.06 kB",
  "precision.r5.k": "add via barrel · gzip",
  "precision.r5.v": "1.24 kB",
  "precision.r6.k": "runtime dependencies",
  "precision.r6.v": "0",
  "precision.note": "Source: <code>packages/core/docs/precision.md</code> · " +
    "size budget in <code>test/tree-shaking.test.ts</code>.",
  "precision.ulp.h": "what is ULP",
  "precision.ulp.p": "Here, ULP is one unit in the last decimal place " +
    "(<code>10^-places</code>), not one bit. At generic angles, trigonometry " +
    "stays within two units of the reference.",
  "precision.ci.h": "pinned in CI",
  "precision.ci.p": "The tree-shaking test fails if the <code>add</code> " +
    "graph passes the budget. CI runs lint, format, tests, build and the " +
    "export check.",

  "install.label": "<b>§ 08</b> — install",
  "install.h2": 'One line and <em class="serif">exact.</em>',
  "install.alt": "or <code>npm add fixed-precision</code> — and " +
    "<code>npm install fixed-precision-fns</code> for the functional layer.",
  "install.pkgs.h": "two packages",
  "install.pkg1": "classes, ./minimal, types",
  "install.pkg2": "functional, 119 subpaths, zero deps",
  "install.req.h": "runs on",
  "install.req.p": "Node, Bun and modern browsers. <code>BigInt</code> is " +
    "native; there is no polyfill.",
  "install.req.p2": "No key, no service, no network call. The lab on this " +
    "page runs the same local build.",
  "install.doc.h": "documentation",
  "install.doc.p": '<a href="https://github.com/naoeosavio/fixed-precision/' +
    'blob/main/packages/core/README.md" target="_blank" rel="noopener">' +
    "core README</a> · " +
    '<a href="https://github.com/naoeosavio/fixed-precision/blob/main/' +
    'packages/fp/README.md" target="_blank" rel="noopener">fns README</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/blob/main/' +
    'packages/core/MIGRATION.md" target="_blank" rel="noopener">' +
    "migration</a>",

  "cta.h2": 'The next invoice <em class="serif">closes.</em>',
  "cta.p": "Two MIT packages, zero runtime dependencies and 119 subpaths. " +
    "For money, tax, discount and any number that cannot miss by a cent.",

  "foot.l": "naoeosavio — fixed-precision is MIT; this page is the storefront.",
  "foot.r": '<a href="https://github.com/naoeosavio/fixed-precision" ' +
    'target="_blank" rel="noopener">repo</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/issues" ' +
    'target="_blank" rel="noopener">issues</a> · ' +
    '<a href="https://www.npmjs.com/package/fixed-precision" ' +
    'target="_blank" rel="noopener">npm</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/tree/main/' +
    'packages/core/docs" target="_blank" rel="noopener">docs</a> · MIT',

  "sb.mode": "mode",
  "sb.exact": "EXACT",
};
