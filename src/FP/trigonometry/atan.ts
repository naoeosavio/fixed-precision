import { atan_value } from "../../core/trigonometry/atan";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function atan(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, atan_value);
}
