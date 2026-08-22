import { natural_log_value } from "../../core/arithmetic/naturalLog";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function naturalLog(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, natural_log_value);
}
