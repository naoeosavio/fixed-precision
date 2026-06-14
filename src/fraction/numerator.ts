import { gcd } from "./gcd";

export function get_numerator(value: bigint, scale: bigint): bigint {
  return value / gcd(value, scale);
}
