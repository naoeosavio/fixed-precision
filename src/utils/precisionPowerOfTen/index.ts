import { powerOfTen } from "../powerOfTen";

export function precisionPowerOfTen(exponent: number): bigint {
  return exponent <= 20 ? powerOfTen(exponent) : 10n ** BigInt(exponent);
}
