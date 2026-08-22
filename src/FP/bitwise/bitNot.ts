import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function bitNot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw) => ~raw);
}
