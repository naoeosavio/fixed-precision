import { natural_log_value } from "../../core/arithmetic/naturalLog";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function naturalLog(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, natural_log_value);
}
