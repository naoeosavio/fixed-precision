import { powerOfTen } from "../powerOfTen";

const LARGE_POWERS = new Map<number, bigint>();

export function precisionPowerOfTen(exponent: number): bigint {
  if (exponent <= 20) return powerOfTen(exponent);
  let cached = LARGE_POWERS.get(exponent);
  if (cached === undefined) {
    cached = 10n ** BigInt(exponent);
    LARGE_POWERS.set(exponent, cached);
  }
  return cached;
}
