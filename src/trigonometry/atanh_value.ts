import { natural_log_value } from "../arithmetic/index";
import type { FPContext } from "../FixedPrecision";

export function atanh_value(value: bigint, ctx: FPContext): bigint {
  if (value <= -ctx.SCALE || value >= ctx.SCALE) {
    throw new Error(
      "Hyperbolic arctangent is defined for values between -1 and 1",
    );
  }

  const numerator = ctx.SCALE + value;
  const denominator = ctx.SCALE - value;
  const ratio = (numerator * ctx.SCALE) / denominator;
  return natural_log_value(ratio, ctx) / 2n;
}
