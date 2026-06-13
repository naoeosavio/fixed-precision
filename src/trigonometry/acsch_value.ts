import type { FPContext } from "../FixedPrecision";
import { asinh_value } from "./asinh_value";
import { assert_non_zero } from "./internal/assert_non_zero";

export function acsch_value(value: bigint, ctx: FPContext): bigint {
  assert_non_zero(value, "Hyperbolic arccosecant is undefined for zero");
  return asinh_value((ctx.SCALE * ctx.SCALE) / value, ctx);
}
