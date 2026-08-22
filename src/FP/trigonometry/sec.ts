import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { sec_value } from "../../core/trigonometry/sec";

export function sec(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sec_value);
}
