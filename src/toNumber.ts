import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toNumber(value: FixedPrecisionValue, places?: number): number {
  return new FixedPrecision(value).toNumber(places);
}
