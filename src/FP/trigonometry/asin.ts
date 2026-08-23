import { asin_value } from "../../core/trigonometry/asin";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function asin(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asin_value);
}
