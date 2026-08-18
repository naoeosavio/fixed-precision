import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import { scale } from "./scale";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "./toString";

export function toFixed(
  value: FixedPrecisionValue,
  places = 0,
  rm?: RoundingMode,
): string {
  return toString(scale(value, places, rm), false);
}
