import { shifted_by_value } from "./arithmetic/shiftedBy";
import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function shiftedBy(
  value: FixedPrecisionValue,
  n: number,
): FixedPrecisionLike {
  const ctx = resolveContext([value]);
  return fromRawWithContext(shifted_by_value(toScaled(value, ctx), n), ctx);
}

registerFunction("shiftedBy", shiftedBy);
