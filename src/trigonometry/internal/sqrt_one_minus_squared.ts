import { sqrt_value } from "../../arithmetic";

export function sqrt_one_minus_squared(value: bigint, scale: bigint): bigint {
  const squared = (value * value) / scale;
  return sqrt_value(scale - squared, scale);
}
