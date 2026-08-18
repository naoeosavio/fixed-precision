import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function bitNot(value: FixedPrecisionValue): FixedPrecision {
  // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
  return FixedPrecision.fromContextValue(value, (raw) => ~raw);
}
