import type { FPContext } from "../../../FixedPrecision";
import { round_to_scale_value } from "../../arithmetic/roundToScale";
import { powerOfTen } from "../../utils/powerOfTen";

export function from_rounded_decimal_string_with_ctx(
  str: string,
  P: number,
  ctx: FPContext,
): bigint {
  const negative = str.startsWith("-");
  const unsigned = negative || str.startsWith("+") ? str.slice(1) : str;
  const u_dot = unsigned.indexOf(".");
  const int_str = unsigned.slice(0, u_dot) || "0";
  const frac_str = unsigned.slice(u_dot + 1);
  const N = BigInt(int_str + frac_str);
  const excess = frac_str.length - P;
  const factor = excess <= 20 ? powerOfTen(excess) : 10n ** BigInt(excess);
  return round_to_scale_value(negative ? -N : N, factor, ctx.roundingMode);
}
