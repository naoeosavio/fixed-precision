import { power } from "../../core/arithmetic/power";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function cube(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => power(raw, 3, ctx.SCALE));
}
