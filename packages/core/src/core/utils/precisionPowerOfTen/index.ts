import { powerOfTen } from "../powerOfTen";

// Built on first use: a top-level `new Map()` would make this module
// side-effectful and defeat tree-shaking of the per-operation entries.
let LARGE_POWERS: Map<number, bigint> | undefined;

export function precisionPowerOfTen(exponent: number): bigint {
  if (exponent <= 20) return powerOfTen(exponent);
  if (LARGE_POWERS === undefined) {
    LARGE_POWERS = new Map<number, bigint>();
  }
  const cache = LARGE_POWERS;
  let cached = cache.get(exponent);
  if (cached === undefined) {
    cached = 10n ** BigInt(exponent);
    cache.set(exponent, cached);
  }
  return cached;
}
