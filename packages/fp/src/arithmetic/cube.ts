import { power } from "../../../core/src/core/arithmetic/power";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function cube(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => power(raw, 3, ctx.SCALE));
}
