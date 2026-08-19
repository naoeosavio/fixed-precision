import { sqrt_value } from "./arithmetic/sqrt";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sqrt(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => sqrt_value(raw, ctx.SCALE));
}

registerFunction("sqrt", sqrt);
