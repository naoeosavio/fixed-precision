import type { FPContext } from "../../../FixedPrecision";
import { from_integer_string_with_ctx } from "../internal/from_integer_string_with_ctx";
import { from_long_decimal_string_with_ctx } from "../internal/from_long_decimal_string_with_ctx";
import { from_rounded_decimal_string_with_ctx } from "../internal/from_rounded_decimal_string_with_ctx";
import { from_short_decimal_string_with_ctx } from "../internal/from_short_decimal_string_with_ctx";

const NUMBER_STRING_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

export function from_string_with_ctx(str: string, ctx: FPContext): bigint {
  if (!NUMBER_STRING_PATTERN.test(str)) {
    throw new Error(
      `Invalid number string "${str}": expected an optional sign followed by digits with an optional decimal point`,
    );
  }

  const P = ctx.places;
  const dot_index = str.indexOf(".");
  const frac_len = dot_index === -1 ? 0 : str.length - dot_index - 1;

  if (frac_len > P) {
    return from_rounded_decimal_string_with_ctx(str, P, ctx);
  }
  if (dot_index === -1) {
    return from_integer_string_with_ctx(str, P, ctx);
  }
  if (dot_index + P < 16) {
    return from_short_decimal_string_with_ctx(str, dot_index, P, ctx);
  }
  return from_long_decimal_string_with_ctx(str, dot_index, P, ctx);
}
