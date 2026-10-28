# Site

Static one-page site for `fixed-precision` and `fixed-precision-fns`. The
rounding lab uses a real browser build of the class API.

## View

Serve the directory over HTTP:

```bash
python3 -m http.server 8080 --directory docs
```

Open <http://127.0.0.1:8080>. The page uses classic scripts, so it also opens
from `file://`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup for every section, with Portuguese fallback text |
| `assets/styles.css` | Base styles, header, hero and terminal |
| `assets/sections.css` | Why, steps, features and the rounding lab |
| `assets/panels.css` | Functional API, core, precision, install and reveal |
| `assets/responsive.css` | Breakpoints and reduced motion |
| `assets/i18n.pt.js` | Portuguese dictionary |
| `assets/i18n.en.js` | English dictionary |
| `assets/app.js` | Language switch, lab, terminal, copy and status bar |
| `assets/fixed-precision.js` | Generated browser bundle of the class API |
| `self-check.mjs` | Checks the bundle, the locales and the HTML wiring |

## Rebuild the browser bundle

The bundle is generated from the TypeScript source. Do not edit it by hand.

```bash
./node_modules/.bin/esbuild packages/core/src/FixedPrecision.ts \
  --bundle --format=iife --global-name=FixedPrecisionLib --minify \
  --target=es2020 --legal-comments=none \
  --banner:js='/* Generated from packages/core/src/FixedPrecision.ts. MIT. */' \
  --outfile=docs/assets/fixed-precision.js
```

The file has no runtime imports. The lab calls `scale(places, mode)` and
`toFixed(places)` on the bundle.

## Check

```bash
node docs/self-check.mjs
```

The check does these steps:

1. Loads the bundle and checks 16 arithmetic results, including all nine
   rounding modes of `2.675` at two places.
2. Loads both locales and compares the key sets.
3. Checks that every `data-i18n` and `data-i18n-aria` key has a translation.
4. Checks every `by_id` reference in `app.js` against the HTML ids.
5. Checks that every `./assets/` reference exists.

## Add a string

1. Add the key to `assets/i18n.pt.js` and `assets/i18n.en.js`.
2. Add `data-i18n="the.key"` to the element in `index.html`.
3. Run `node docs/self-check.mjs`.

Keep both dictionaries in the same order.
