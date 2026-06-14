import { powerOfTen } from "../../utils";

export function from_long_decimal_with_large_scale_number_integer(
  int: number,
  fac_str: string,
  new_len: number,
  SCALE_NUM: number,
): bigint {
  const frac = BigInt(fac_str);
  if (!frac) {
    return BigInt(int * SCALE_NUM);
  }
  const n_scaled = frac * powerOfTen(new_len);
  return int < 0
    ? BigInt(int * SCALE_NUM) - n_scaled
    : BigInt(int * SCALE_NUM) + n_scaled;
}
