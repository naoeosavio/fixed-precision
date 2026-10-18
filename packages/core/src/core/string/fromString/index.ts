import type { FPContext } from "../../../FixedPrecision";
import { powerOfTen } from "../../utils";
import { from_rounded_decimal_string_with_ctx } from "../internal/from_rounded_decimal_string_with_ctx";

const NUMBER_STRING_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

/**
 * Parses a decimal string into a scaled value. The parse is exact.
 *
 * @param str - Decimal text with an optional sign and decimal point.
 * @param ctx - Target context with the decimal places.
 * @returns Raw scaled value.
 */
export function from_string_with_ctx(str: string, ctx: FPContext): bigint {
  if (!NUMBER_STRING_PATTERN.test(str)) {
    throw new Error(
      `Invalid number string "${str}": expected an optional sign followed by digits with an optional decimal point`,
    );
  }

  const P = ctx.places;
  const dot_index = str.indexOf(".");
  if (dot_index === -1) {
    // Fast path: fewer than 16 digits in total stay exact in float64.
    if (str.length + P < 16) {
      return BigInt(Number(str) * ctx.SCALENUMBER);
    }
    return BigInt(str) * ctx.SCALE;
  }

  const frac_len = str.length - dot_index - 1;
  if (frac_len > P) {
    return from_rounded_decimal_string_with_ctx(str, P, ctx);
  }

  const digits = str.slice(0, dot_index) + str.slice(dot_index + 1);
  return BigInt(digits) * powerOfTen(P - frac_len);
}
