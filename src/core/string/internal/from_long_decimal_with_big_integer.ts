import { powerOfTen } from "../../utils";

export function from_long_decimal_with_big_integer(
  int_str: string,
  fac_str: string,
  new_len: number,
  P: number,
  SCALE_BIG: bigint,
): bigint {
  const int = BigInt(int_str);
  if (P < 16) {
    const frac = Number(fac_str);
    if (!frac) {
      return int * SCALE_BIG;
    }
    const n_scaled = BigInt(frac * 10 ** new_len);
    return int < 0n ? int * SCALE_BIG - n_scaled : int * SCALE_BIG + n_scaled;
  }
  const frac = BigInt(fac_str);
  if (!frac) {
    return int * SCALE_BIG;
  }
  const n_scaled = frac * powerOfTen(new_len);
  return int < 0n ? int * SCALE_BIG - n_scaled : int * SCALE_BIG + n_scaled;
}
