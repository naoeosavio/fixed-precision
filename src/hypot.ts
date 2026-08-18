import { sqrt_value } from "./arithmetic/sqrt";
import { collectValues } from "./construction/values";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function hypot(
  value?: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecision {
  if (value === undefined) {
    return new FixedPrecision(0n);
  }

  const all = collectValues(value, values);
  const ctx = FixedPrecision.resolveContext(all);
  let total = 0n;
  for (const v of all) {
    const raw = FixedPrecision.toScaled(v, ctx);
    total += (raw * raw) / ctx.SCALE;
  }
  return FixedPrecision.fromRawWithContext(sqrt_value(total, ctx.SCALE), ctx);
}
