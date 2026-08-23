import { sqrt_value } from "../../core/arithmetic/sqrt";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sqrt(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => sqrt_value(raw, ctx.SCALE));
}
