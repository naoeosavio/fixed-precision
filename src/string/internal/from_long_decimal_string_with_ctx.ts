import type { FPContext } from "../../FixedPrecision";
import { from_long_decimal_with_big_integer } from "./from_long_decimal_with_big_integer";
import { from_long_decimal_with_number_integer } from "./from_long_decimal_with_number_integer";

export function from_long_decimal_string_with_ctx(
  str: string,
  dot_index: number,
  P: number,
  ctx: FPContext,
): bigint {
  const int_str = str.slice(0, dot_index);
  const fac_str = str.slice(dot_index + 1, dot_index + 1 + P);
  const faclen = fac_str.length;
  const new_len = P >= faclen ? P - faclen : P;

  if (dot_index < 16) {
    return from_long_decimal_with_number_integer(
      int_str,
      fac_str,
      dot_index,
      new_len,
      P,
      ctx,
    );
  }

  return from_long_decimal_with_big_integer(
    int_str,
    fac_str,
    new_len,
    P,
    ctx.SCALE,
  );
}
