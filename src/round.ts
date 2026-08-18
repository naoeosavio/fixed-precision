import { round_value } from "./arithmetic/round";
import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function round(
  value: FixedPrecisionValue,
  dp?: number,
  rm?: RoundingMode,
): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    round_value(
      raw,
      dp !== undefined ? dp : ctx.places,
      rm !== undefined ? rm : ctx.roundingMode,
      ctx,
    ),
  );
}
