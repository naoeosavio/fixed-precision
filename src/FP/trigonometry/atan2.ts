import { atan2_value } from "../../core/trigonometry/atan2";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContextPair,
  toScaled,
} from "../construction";

export function atan2(
  y: FixedPrecisionOperand,
  x: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContextPair(y, x);
  return fromRawWithContext(
    atan2_value(toScaled(y, ctx), toScaled(x, ctx), ctx),
    ctx,
  );
}
