import { cbrt_value } from "../../../core/src/core/arithmetic/cbrt";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function cbrt(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => cbrt_value(raw, ctx.SCALE));
}
