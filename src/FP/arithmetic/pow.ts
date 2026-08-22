import { power } from "../../core/arithmetic/power";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function pow(
  value: FixedPrecisionOperand,
  exp: number,
): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => power(raw, exp, ctx.SCALE));
}
