import { asech_value } from "../../../core/src/core/trigonometry/asech";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function asech(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asech_value);
}
