import { squareRoot } from "../../geometry/sqrt";
import { atan_series_work } from "./atan_series_work";

export function atan_reduced_work(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return 0n;
  }

  const value_squared = (value * value) / scale;
  const root = squareRoot(scale + value_squared, scale);
  const reduced = (value * scale) / (scale + root);
  return atan_series_work(reduced, scale) << 1n;
}
