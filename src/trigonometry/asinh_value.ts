import { natural_log_value, sqrt_value } from "../arithmetic/index";
import type { FPContext } from "../FixedPrecision";

export function asinh_value(value: bigint, ctx: FPContext): bigint {
  const x_squared = (value * value) / ctx.SCALE;
  const root = sqrt_value(x_squared + ctx.SCALE, ctx.SCALE);
  return natural_log_value(value + root, ctx);
}
