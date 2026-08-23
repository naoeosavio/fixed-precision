import { acoth_value } from "../../core/trigonometry/acoth";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acoth(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acoth_value);
}
