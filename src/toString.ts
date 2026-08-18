import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { to_string_with_ctx } from "./string/toString";

// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
export function toString(value: FixedPrecisionValue, trimZeros = true): string {
  const ctx = FixedPrecision.resolveContext([value]);
  return to_string_with_ctx(
    FixedPrecision.toScaled(value, ctx),
    ctx,
    trimZeros,
  );
}
