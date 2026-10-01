import { sqrt_value } from "../../arithmetic";

export function sqrt_one_minus_squared(value: bigint, scale: bigint): bigint {
  const delta = ((scale - value) * (scale + value)) / scale;
  return sqrt_value(delta, scale);
}
