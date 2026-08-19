import { cbrt_value } from "./arithmetic/cbrt";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cbrt(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => cbrt_value(raw, ctx.SCALE));
}

registerFunction("cbrt", cbrt);
