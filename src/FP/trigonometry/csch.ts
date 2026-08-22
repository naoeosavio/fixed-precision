import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { csch_value } from "../../core/trigonometry/csch";

export function csch(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, csch_value);
}
