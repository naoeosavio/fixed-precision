import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { tan_value } from "../../core/trigonometry/tan";

export function tan(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, tan_value);
}
