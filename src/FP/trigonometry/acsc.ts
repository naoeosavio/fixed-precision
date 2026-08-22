import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acsc_value } from "../../core/trigonometry/acsc";

export function acsc(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acsc_value);
}
