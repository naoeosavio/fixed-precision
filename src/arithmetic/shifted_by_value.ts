import { precisionPowerOfTen } from "../utils";

export function shifted_by_value(value: bigint, n: number): bigint {
  const shift_factor = precisionPowerOfTen(Math.abs(n));
  if (n >= 0) {
    return value * shift_factor;
  } else {
    return value / shift_factor;
  }
}
