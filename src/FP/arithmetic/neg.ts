import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function neg(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw) => -raw);
}
