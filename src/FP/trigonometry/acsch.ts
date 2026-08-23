import { acsch_value } from "../../core/trigonometry/acsch";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acsch(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acsch_value);
}
