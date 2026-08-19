import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function bitOr(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): FixedPrecisionLike {
  const ctx = resolveContext([left, right]);
  return fromRawWithContext(
    // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
    toScaled(left, ctx) | toScaled(right, ctx),
    ctx,
  );
}

registerFunction("bitOr", bitOr);
