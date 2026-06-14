import { exp_value } from "../arithmetic/index";
import type { FPContext } from "../FixedPrecision";

export function tanh_value(value: bigint, ctx: FPContext): bigint {
  const doubled = value * 2n;
  const exponent = exp_value(doubled, ctx);
  return ((exponent - ctx.SCALE) * ctx.SCALE) / (exponent + ctx.SCALE);
}
