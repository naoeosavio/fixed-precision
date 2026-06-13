import type { FPContext } from "../FixedPrecision";
import { reciprocal_value } from "./internal/reciprocal_value";
import { tanh_value } from "./tanh_value";

export function coth_value(value: bigint, ctx: FPContext): bigint {
  return reciprocal_value(tanh_value(value, ctx), ctx, "Hyperbolic cotangent");
}
