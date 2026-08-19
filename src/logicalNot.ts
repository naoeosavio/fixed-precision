import { registerFunction, resolveContext, toScaled } from "./core/value";
import { logicalNotValue } from "./logical/logicalNot";
import type { FixedPrecisionValue } from "./types";

export function logicalNot(value: FixedPrecisionValue): boolean {
  const ctx = resolveContext([value]);
  return logicalNotValue(toScaled(value, ctx));
}

registerFunction("logicalNot", logicalNot);
