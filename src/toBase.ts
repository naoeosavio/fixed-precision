import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toBase(
  value: FixedPrecisionValue,
  base: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  return new FixedPrecision(value).toBase(base, sd, rm);
}
