import type { FPContext } from "../FixedPrecision";
import { asin_value } from "./asin_value";
import { assert_outside_minus_one_to_one } from "./internal/assert_outside";

export function acsc_value(value: bigint, ctx: FPContext): bigint {
  assert_outside_minus_one_to_one(value, ctx, "Arccosecant");
  return asin_value((ctx.SCALE * ctx.SCALE) / value, ctx);
}
