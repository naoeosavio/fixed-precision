import { powerOfTen } from "../../utils";

export function from_long_decimal_with_safe_number_integer(
  int: number,
  fac_str: string,
  new_len: number,
  P: number,
  SCALE_NUM: number,
): bigint {
  const n_num = int * SCALE_NUM;
  if (P < 16) {
    const frac = Number(fac_str);
    const n_scaled = BigInt(frac * 10 ** new_len);
    return n_num < 0 ? BigInt(n_num) - n_scaled : BigInt(n_num) + n_scaled;
  }

  const frac = BigInt(fac_str);
  const n_scaled = frac * powerOfTen(new_len);
  return n_num < 0 ? BigInt(n_num) - n_scaled : BigInt(n_num) + n_scaled;
}
