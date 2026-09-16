import { power } from "../../core/arithmetic/power";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function pow(
  value: FixedPrecisionOperand,
  exp: number,
): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => power(raw, exp, ctx.SCALE));
}

export function powBy(exp: number) {
  return (value: FixedPrecisionOperand): FixedPrecisionData => pow(value, exp);
}
