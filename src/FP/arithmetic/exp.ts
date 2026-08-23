import { exp_value } from "../../core/arithmetic/exp";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function exp(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, exp_value);
}
