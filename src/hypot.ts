import { sqrt_value } from "./arithmetic/sqrt";
import { collectValues } from "./construction/values";
import {
  construct,
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function hypot(
  value?: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecisionLike {
  if (value === undefined) {
    return construct(0n);
  }

  const all = collectValues(value, values);
  const ctx = resolveContext(all);
  let total = 0n;
  for (const v of all) {
    const raw = toScaled(v, ctx);
    total += (raw * raw) / ctx.SCALE;
  }
  return fromRawWithContext(sqrt_value(total, ctx.SCALE), ctx);
}

registerFunction("hypot", hypot);
