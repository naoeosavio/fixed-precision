import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { atan2_value } from "./trigonometry/atan2";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function atan2(
  y: FixedPrecisionValue,
  x: FixedPrecisionValue,
): FixedPrecisionLike {
  const ctx = resolveContext([y, x]);
  return fromRawWithContext(
    atan2_value(toScaled(y, ctx), toScaled(x, ctx), ctx),
    ctx,
  );
}

registerFunction("atan2", atan2);
