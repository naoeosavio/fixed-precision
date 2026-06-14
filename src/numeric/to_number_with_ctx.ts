import type { FPContext } from "../FixedPrecision";
import { to_string_with_ctx } from "../string/index";

const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

export function to_number_with_ctx(value: bigint, ctx: FPContext): number {
  const abs = value < 0n ? -value : value;
  if (abs <= MAX_SAFE_BIGINT) {
    return Number(value) / ctx.SCALENUMBER;
  }

  if (ctx.places < 15) {
    const int_part = value / ctx.SCALE;
    const frac_part = value - int_part * ctx.SCALE;
    return Number(int_part) + Number(frac_part) / ctx.SCALENUMBER;
  }

  return Number(to_string_with_ctx(value, ctx));
}
