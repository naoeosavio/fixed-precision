import type { FPContext } from "../FixedPrecision";
import { from_integer_string_with_ctx } from "./internal/from_integer_string_with_ctx";
import { from_long_decimal_string_with_ctx } from "./internal/from_long_decimal_string_with_ctx";
import { from_short_decimal_string_with_ctx } from "./internal/from_short_decimal_string_with_ctx";

export function from_string_with_ctx(str: string, ctx: FPContext): bigint {
  const dot_index = str.indexOf(".", 1);
  const P = ctx.places;
  if (dot_index === -1) {
    return from_integer_string_with_ctx(str, P, ctx);
  }
  if (dot_index + P < 16) {
    return from_short_decimal_string_with_ctx(str, dot_index, P, ctx);
  }
  return from_long_decimal_string_with_ctx(str, dot_index, P, ctx);
}
