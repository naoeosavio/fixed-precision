import { cosh_value } from "../../../core/src/core/trigonometry/cosh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function cosh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cosh_value);
}
