import { round_value } from "./arithmetic/round";
import { fromContextValue, registerFunction } from "./core/value";
import type {
  FixedPrecisionLike,
  FixedPrecisionValue,
  RoundingMode,
} from "./types";

export function round(
  value: FixedPrecisionValue,
  dp?: number,
  rm?: RoundingMode,
): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) =>
    round_value(
      raw,
      dp !== undefined ? dp : ctx.places,
      rm !== undefined ? rm : ctx.roundingMode,
      ctx,
    ),
  );
}

registerFunction("round", round);
