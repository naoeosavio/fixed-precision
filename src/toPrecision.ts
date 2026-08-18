import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toPrecision(
  value: FixedPrecisionValue,
  sd: number,
  rm?: RoundingMode,
): string {
  return new FixedPrecision(value).toPrecision(sd, rm);
}
