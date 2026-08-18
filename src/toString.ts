import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
export function toString(value: FixedPrecisionValue, trimZeros = true): string {
  return new FixedPrecision(value).toString(trimZeros);
}
