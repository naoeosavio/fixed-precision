import { log_value } from "./arithmetic/log";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { naturalLog } from "./naturalLog";

export function log(
  value: FixedPrecisionValue,
  base?: FixedPrecisionValue,
): FixedPrecision {
  if (base === undefined) {
    return naturalLog(value);
  }

  const ctx = FixedPrecision.resolveContext([value, base]);
  return FixedPrecision.fromRawWithContext(
    log_value(
      FixedPrecision.toScaled(value, ctx),
      FixedPrecision.toScaled(base, ctx),
      ctx,
    ),
    ctx,
  );
}
