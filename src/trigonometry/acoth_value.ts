import type { FPContext } from "../FixedPrecision";
import { atanh_value } from "./atanh_value";

export function acoth_value(value: bigint, ctx: FPContext): bigint {
  if (value >= -ctx.SCALE && value <= ctx.SCALE) {
    throw new Error(
      "Hyperbolic arccotangent is defined for absolute values greater than 1",
    );
  }

  return atanh_value((ctx.SCALE * ctx.SCALE) / value, ctx);
}
