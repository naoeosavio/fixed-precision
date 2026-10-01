// Built on first use: a top-level `new Map()` would make this module
// side-effectful and defeat tree-shaking of the per-operation entries.
let BASE_POWER_CACHE: Map<number, bigint> | undefined;

export function base_power(radix: 2 | 8 | 16, exponent: number): bigint {
  if (BASE_POWER_CACHE === undefined) {
    BASE_POWER_CACHE = new Map<number, bigint>();
  }
  const cache = BASE_POWER_CACHE;
  const key = radix * 0x10000 + exponent;
  let cached = cache.get(key);
  if (cached === undefined) {
    cached = BigInt(radix) ** BigInt(exponent);
    cache.set(key, cached);
  }
  return cached;
}
