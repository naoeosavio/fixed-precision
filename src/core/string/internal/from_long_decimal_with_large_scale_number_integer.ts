import { powerOfTen } from "../../utils";

export function from_long_decimal_with_large_scale_number_integer(
  int: number,
  fac_str: string,
  new_len: number,
  SCALE_NUM: number,
): bigint {
  const frac = BigInt(fac_str);
  const scaled_int = BigInt(int) * BigInt(SCALE_NUM);
  if (!frac) {
    return scaled_int;
  }
  const n_scaled = frac * powerOfTen(new_len);
  return int < 0 ? scaled_int - n_scaled : scaled_int + n_scaled;
}
