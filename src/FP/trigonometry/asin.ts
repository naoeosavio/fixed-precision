import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { asin_value } from "../../core/trigonometry/asin";

export function asin(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asin_value);
}
