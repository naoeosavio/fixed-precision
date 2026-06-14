import { gcd } from "../arithmetic";
import { limit_denominator } from "./internal/limit_denominator";

export function to_fraction(
  value: bigint,
  scale: bigint,
  max_den?: bigint,
): { numerator: bigint; denominator: bigint } {
  const common = gcd(value, scale);
  const exact = {
    numerator: value / common,
    denominator: scale / common,
  };

  if (max_den === undefined) {
    return exact;
  }

  return limit_denominator(exact.numerator, exact.denominator, max_den);
}
