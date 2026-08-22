import { sqrt_value } from "../../core/arithmetic/sqrt";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function sqrt(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => sqrt_value(raw, ctx.SCALE));
}
