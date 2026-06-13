import type { FPContext } from "../FixedPrecision";
import { squareRoot } from "../geometry/sqrt";
import { naturalLogValue } from "../numeric/transcendental";

export function asinh_value(value: bigint, ctx: FPContext): bigint {
  const x_squared = (value * value) / ctx.SCALE;
  const root = squareRoot(x_squared + ctx.SCALE, ctx.SCALE);
  return naturalLogValue(value + root, ctx);
}
