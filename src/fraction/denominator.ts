import { gcd } from "../arithmetic";

export function get_denominator(value: bigint, scale: bigint): bigint {
  return scale / gcd(value, scale);
}
