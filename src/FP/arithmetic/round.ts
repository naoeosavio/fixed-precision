import { round_value } from "../../core/arithmetic/round";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
  RoundingMode,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

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
