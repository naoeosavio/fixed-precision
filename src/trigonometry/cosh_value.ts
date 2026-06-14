import type { FPContext } from "../FixedPrecision";
import { exp_value } from "../numeric/index";

export function cosh_value(value: bigint, ctx: FPContext): bigint {
  const positive = exp_value(value, ctx);
  const negative = exp_value(-value, ctx);
  return (positive + negative) >> 1n;
}
