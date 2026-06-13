import type { FPContext } from "../FixedPrecision";
import { expValue } from "../numeric/transcendental";

export function tanh_value(value: bigint, ctx: FPContext): bigint {
  const doubled = value * 2n;
  const exponent = expValue(doubled, ctx);
  return ((exponent - ctx.SCALE) * ctx.SCALE) / (exponent + ctx.SCALE);
}
