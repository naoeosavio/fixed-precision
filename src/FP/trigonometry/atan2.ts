import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";
import { atan2_value } from "../../core/trigonometry/atan2";

export function atan2(
  y: FixedPrecisionOperand,
  x: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([y, x]);
  return fromRawWithContext(
    atan2_value(toScaled(y, ctx), toScaled(x, ctx), ctx),
    ctx,
  );
}
