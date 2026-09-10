import type { FPContext } from "../../../FixedPrecision";
import { exp_value } from "../../arithmetic/index";
import { is_small_x, sinh_series_small } from "../internal/hyperbolic_small";

export function sinh_value(value: bigint, ctx: FPContext): bigint {
  if (is_small_x(value, ctx.SCALE)) {
    return sinh_series_small(value, ctx.SCALE);
  }
  const positive = exp_value(value, ctx);
  const negative = exp_value(-value, ctx);
  return (positive - negative) / 2n;
}
