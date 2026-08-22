import { exp_value } from "../../core/arithmetic/exp";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function exp(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, exp_value);
}
