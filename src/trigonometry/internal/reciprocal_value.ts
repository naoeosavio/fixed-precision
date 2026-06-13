import type { FPContext } from "../../FixedPrecision";
import { assert_non_zero } from "./assert_non_zero";

export function reciprocal_value(
  value: bigint,
  ctx: FPContext,
  name: string,
): bigint {
  assert_non_zero(value, `${name} is undefined for zero`);
  return (ctx.SCALE * ctx.SCALE) / value;
}
