import { registerFunction, resolveContext, toScaled } from "./core/value";
import { logicalXorValues } from "./logical/logicalXor";
import type { FixedPrecisionValue } from "./types";

export function logicalXor(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalXorValues(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("logicalXor", logicalXor);
