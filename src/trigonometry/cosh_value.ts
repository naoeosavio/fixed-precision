import type { FPContext } from "../FixedPrecision";
import { expValue } from "../numeric/transcendental";

export function cosh_value(value: bigint, ctx: FPContext): bigint {
  const positive = expValue(value, ctx);
  const negative = expValue(-value, ctx);
  return (positive + negative) >> 1n;
}
