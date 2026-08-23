import { atan2_value } from "../../core/trigonometry/atan2";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

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
