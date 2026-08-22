import { powerOfTen } from "../../utils";

export function from_long_decimal_with_small_scale_number_integer(
  int: number,
  fac_str: string,
  dot_index: number,
  new_len: number,
  P: number,
  SCALE_NUM: number,
): bigint {
  const frac = Number(fac_str);
  const nP = 16 - dot_index;
  if (nP >= P) {
    return BigInt(int * SCALE_NUM + frac);
  }

  const Num = int * 10 ** nP;
  const n_scaled = BigInt(frac * 10 ** new_len);
  return int < 0
    ? BigInt(Num) * powerOfTen(P - nP) - n_scaled
    : BigInt(Num) * powerOfTen(P - nP) + n_scaled;
}
