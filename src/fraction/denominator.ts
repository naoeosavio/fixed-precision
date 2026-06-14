import { gcd } from "./gcd";

export function get_denominator(value: bigint, scale: bigint): bigint {
  return scale / gcd(value, scale);
}
