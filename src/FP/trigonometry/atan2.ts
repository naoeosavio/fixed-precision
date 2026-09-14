import { atan2_value } from "../../core/trigonometry/atan2";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
} from "../construction";

export function atan2(
  y: FixedPrecisionOperand,
  x: FixedPrecisionOperand,
): FixedPrecisionData {
  const scaled = toScaledPair(y, x);
  return fromRawWithContext(
    atan2_value(scaled.left, scaled.right, scaled.ctx),
    scaled.ctx,
  );
}
