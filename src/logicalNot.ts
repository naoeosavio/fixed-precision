import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { logicalNotValue } from "./logical/logicalNot";

export function logicalNot(value: FixedPrecisionValue): boolean {
  const ctx = FixedPrecision.resolveContext([value]);
  return logicalNotValue(FixedPrecision.toScaled(value, ctx));
}
