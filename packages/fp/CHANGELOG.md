# Changelog

All notable changes to the `fixed-precision-fp` package will be documented in
this file. For the class API, see
[`fixed-precision`](../core/CHANGELOG.md).

## [1.0.0] — unreleased

First release. The functional layer of `fixed-precision` v1.x, extracted into its
own package with the same 118 subpaths.

### Notes

- No behavioural change relative to `fixed-precision@1.7.3`: this is the same
  code, moved. Migrating is a rename — see
  [`fixed-precision`'s MIGRATION.md](../core/MIGRATION.md).
- `fixed-precision` is a runtime dependency and is never bundled here, so an app
  that uses both packages has exactly one copy of every operation.
- The barrel entry (`import { add } from "fixed-precision-fp"`) re-exports
  everything; importing from a subpath is what keeps the bundle small.
- `context`, `safeIndex`, `types` and `value` are internal building blocks. They
  are reachable through the barrel but have no subpath, exactly as in v1.7.3.
