import type { FPContext } from "../../FixedPrecision";
import { powerOfTen } from "../../utils";

export function from_short_decimal_string_with_ctx(
  str: string,
  dot_index: number,
  P: number,
  ctx: FPContext,
): bigint {
  const SCALE_NUM = ctx.SCALENUMBER;
  const num = Number(str);
  const nP = 16 - dot_index;
  const n_scaled = num < 0 ? -1 / SCALE_NUM : 1 / SCALE_NUM;

  if (nP >= P) {
    return BigInt(Math.trunc(num * SCALE_NUM + n_scaled));
  }

  const Num = num * 10 ** nP;
  const new_num = Math.trunc(Num);
  const New_Frac = Math.trunc(new_num - Num);
  if (!New_Frac) {
    return BigInt(new_num) * powerOfTen(P - nP);
  }
  return BigInt(new_num) * powerOfTen(P - nP) + BigInt(New_Frac);
}
