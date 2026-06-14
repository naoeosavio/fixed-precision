import type { FPContext } from "../../FixedPrecision";
import { from_long_decimal_with_large_scale_number_integer } from "./from_long_decimal_with_large_scale_number_integer";
import { from_long_decimal_with_safe_number_integer } from "./from_long_decimal_with_safe_number_integer";
import { from_long_decimal_with_small_scale_number_integer } from "./from_long_decimal_with_small_scale_number_integer";

export function from_long_decimal_with_number_integer(
  int_str: string,
  fac_str: string,
  dot_index: number,
  new_len: number,
  P: number,
  ctx: FPContext,
): bigint {
  const int = Number(int_str);
  const SCALE_NUM = ctx.SCALENUMBER;
  if (Math.abs(int) <= Number.MAX_SAFE_INTEGER / SCALE_NUM) {
    return from_long_decimal_with_safe_number_integer(
      int,
      fac_str,
      new_len,
      P,
      SCALE_NUM,
    );
  }
  if (P < 16) {
    return from_long_decimal_with_small_scale_number_integer(
      int,
      fac_str,
      dot_index,
      new_len,
      P,
      SCALE_NUM,
    );
  }
  return from_long_decimal_with_large_scale_number_integer(
    int,
    fac_str,
    new_len,
    SCALE_NUM,
  );
}
