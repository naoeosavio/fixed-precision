import { round_value } from "../../core/arithmetic/round";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
  type RoundingMode,
} from "../construction";

export function round(
  value: FixedPrecisionOperand,
  dp?: number,
  rm?: RoundingMode,
): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) =>
    round_value(
      raw,
      dp !== undefined ? dp : ctx.places,
      rm !== undefined ? rm : ctx.roundingMode,
      ctx,
    ),
  );
}
