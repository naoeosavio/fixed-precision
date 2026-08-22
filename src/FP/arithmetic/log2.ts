import { log2_value } from "../../core/arithmetic/log2";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function log2(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, log2_value);
}
