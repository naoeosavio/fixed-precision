import { root_value } from "../../core/arithmetic/root";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function root(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => root_value(raw, n, ctx.SCALE));
}
