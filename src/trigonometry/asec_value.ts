import type { FPContext } from "../FixedPrecision";
import { acos_value } from "./acos_value";
import { assert_outside_minus_one_to_one } from "./internal/assert_outside";

export function asec_value(value: bigint, ctx: FPContext): bigint {
  assert_outside_minus_one_to_one(value, ctx, "Arcsecant");
  return acos_value((ctx.SCALE * ctx.SCALE) / value, ctx);
}
