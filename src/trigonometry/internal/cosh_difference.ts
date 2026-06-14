import { exp_value } from "../../arithmetic";
import type { FPContext } from "../../FixedPrecision";

export function cosh_difference(value: bigint, ctx: FPContext): bigint {
  const positive = exp_value(value, ctx);
  const negative = exp_value(-value, ctx);
  return (positive - negative) / 2n;
}
