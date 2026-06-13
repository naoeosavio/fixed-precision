import { squareRoot } from "../../geometry/sqrt";

export function sqrt_one_minus_squared(value: bigint, scale: bigint): bigint {
  const squared = (value * value) / scale;
  return squareRoot(scale - squared, scale);
}
