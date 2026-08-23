import { round_value } from "../../core/arithmetic/round";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function trunc(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => round_value(raw, 0, 1, ctx));
}
