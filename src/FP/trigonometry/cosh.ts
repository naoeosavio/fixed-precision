import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { cosh_value } from "../../core/trigonometry/cosh";

export function cosh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cosh_value);
}
