import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { csc_value } from "../../core/trigonometry/csc";

export function csc(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, csc_value);
}
