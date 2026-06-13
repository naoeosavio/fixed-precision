import type { FPContext } from "../FixedPrecision";
import { squareRoot } from "../geometry/sqrt";
import { natural_log_value } from "../numeric/index.js";

export function asinh_value(value: bigint, ctx: FPContext): bigint {
  const x_squared = (value * value) / ctx.SCALE;
  const root = squareRoot(x_squared + ctx.SCALE, ctx.SCALE);
  return natural_log_value(value + root, ctx);
}
