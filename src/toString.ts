import { registerFunction, resolveContext, toScaled } from "./core/value";
import { to_string_with_ctx } from "./string/toString";
import type { FixedPrecisionValue } from "./types";

// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
export function toString(value: FixedPrecisionValue, trimZeros = true): string {
  const ctx = resolveContext([value]);
  return to_string_with_ctx(toScaled(value, ctx), ctx, trimZeros);
}

registerFunction("toString", toString);
