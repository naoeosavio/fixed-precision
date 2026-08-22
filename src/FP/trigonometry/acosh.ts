import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acosh_value } from "../../core/trigonometry/acosh";

export function acosh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acosh_value);
}
