import { gcd } from "../arithmetic";

export function get_numerator(value: bigint, scale: bigint): bigint {
  return value / gcd(value, scale);
}
