import { acosh_value } from "../../core/trigonometry/acosh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acosh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acosh_value);
}
