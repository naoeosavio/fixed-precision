import { cbrt_value } from "../../core/arithmetic/cbrt";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function cbrt(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => cbrt_value(raw, ctx.SCALE));
}
