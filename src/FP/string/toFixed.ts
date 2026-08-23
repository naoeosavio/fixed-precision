import { scale } from "../arithmetic/scale";
import type { FixedPrecisionOperand, RoundingMode } from "../construction";
import { stringify } from "./stringify";

export function toFixed(
  value: FixedPrecisionOperand,
  places = 0,
  rm?: RoundingMode,
): string {
  return stringify(scale(value, places, rm), false);
}
