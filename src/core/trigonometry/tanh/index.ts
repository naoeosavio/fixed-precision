import type { FPContext } from "../../../FixedPrecision";
import { exp_value } from "../../arithmetic/index";
import { is_small_x, tanh_series_small } from "../internal/hyperbolic_small";

export function tanh_value(value: bigint, ctx: FPContext): bigint {
  if (is_small_x(value, ctx.SCALE)) {
    return tanh_series_small(value, ctx.SCALE);
  }
  const doubled = value * 2n;
  const exponent = exp_value(doubled, ctx);
  return ((exponent - ctx.SCALE) * ctx.SCALE) / (exponent + ctx.SCALE);
}
