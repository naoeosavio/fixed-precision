import { natural_log_value, sqrt_value } from "../arithmetic/index";
import type { FPContext } from "../FixedPrecision";

export function acosh_value(value: bigint, ctx: FPContext): bigint {
  if (value < ctx.SCALE) {
    throw new Error(
      "Hyperbolic arccosine is defined for values greater than or equal to 1",
    );
  }

  const x_squared = (value * value) / ctx.SCALE;
  const root = sqrt_value(x_squared - ctx.SCALE, ctx.SCALE);
  return natural_log_value(value + root, ctx);
}
