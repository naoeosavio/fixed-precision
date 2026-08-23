import { log2_value } from "../../core/arithmetic/log2";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function log2(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, log2_value);
}
