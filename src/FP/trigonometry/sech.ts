import { sech_value } from "../../core/trigonometry/sech";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sech(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sech_value);
}
