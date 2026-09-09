import { powerOfTen } from "../../utils";

export function from_long_decimal_with_safe_number_integer(
  int: number,
  fac_str: string,
  new_len: number,
  P: number,
  SCALE_NUM: number,
): bigint {
  const is_negative = int < 0 || Object.is(int, -0);
  const n_num = BigInt(int) * BigInt(SCALE_NUM);
  if (P < 16) {
    const frac = Number(fac_str);
    const n_scaled = BigInt(frac * 10 ** new_len);
    return is_negative ? n_num - n_scaled : n_num + n_scaled;
  }

  const frac = BigInt(fac_str);
  const n_scaled = frac * powerOfTen(new_len);
  return is_negative ? n_num - n_scaled : n_num + n_scaled;
}
