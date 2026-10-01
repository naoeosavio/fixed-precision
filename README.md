# fixed-precision

Monorepo for fixed-precision decimal arithmetic: two published packages, one
implementation.

| Package | npm | What it is |
|---------|-----|------------|
| [`packages/core`](packages/core) | [`fixed-precision`](https://www.npmjs.com/package/fixed-precision) | The class API — `new FixedPrecision(...)` and the `Minimal` variant |
| [`packages/fp`](packages/fp) | [`fixed-precision-fp`](https://www.npmjs.com/package/fixed-precision-fp) | The functional API — one tree-shakeable subpath per operation, plus `pipe`/`compose`/`partial` |

`fixed-precision-fp` builds the value-level operations of `fixed-precision` into its
own entries and declares the core as a dev dependency, so nothing is resolved at
runtime. The core knows nothing about the functional layer: installing
`fixed-precision` alone pulls none of it.

## Repository layout

```
packages/core   fixed-precision        src/core/** (value-level operations), FixedPrecision.ts, Minimal.ts
packages/fp     fixed-precision-fp     src/** (one module per operation, core built in)
scripts         gen_exports.mjs        writes the `exports` map of both packages
tasks           execution plans, one file per group
```

Every publishable entry point is derived from what is on disk, so the `exports`
map cannot drift from the files tsup builds.

## Development

```bash
npm install          # links both workspaces
npm test             # vitest, one project per package
npm run lint         # tsc per package
npm run build        # core, then fp (fp needs the core's types)
npm run ci           # lint + format + test + build + attw on both packages
```

Both packages resolve each other through TypeScript `paths` and a Vitest alias
that point at the sources, so tests and type-checking run without a build step.

After adding or removing an operation module:

```bash
npm run exports:gen   # regenerate the exports map of both packages
npm run check:exports # in CI: fails if either package.json is stale
```

## Documentation

- Class API: [`packages/core/README.md`](packages/core/README.md) and
  [`packages/core/docs/`](packages/core/docs)
- Functional API: [`packages/fp/README.md`](packages/fp/README.md) and
  [`packages/fp/docs/`](packages/fp/docs)
- Coming from `fixed-precision@1`: [`packages/core/MIGRATION.md`](packages/core/MIGRATION.md)

## License

MIT — see [LICENSE](packages/core/LICENSE).
