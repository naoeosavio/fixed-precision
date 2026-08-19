import { registerFunction } from "./core/value";
import { scale } from "./scale";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "./toString";
import type { FixedPrecisionValue, RoundingMode } from "./types";

export function toFixed(
  value: FixedPrecisionValue,
  places = 0,
  rm?: RoundingMode,
): string {
  return toString(scale(value, places, rm), false);
}

registerFunction("toFixed", toFixed);
