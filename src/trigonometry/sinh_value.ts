import { exp_value } from "../arithmetic/index";
import type { FPContext } from "../FixedPrecision";

export function sinh_value(value: bigint, ctx: FPContext): bigint {
  const positive = exp_value(value, ctx);
  const negative = exp_value(-value, ctx);
  return (positive - negative) / 2n;
}
