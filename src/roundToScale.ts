import { scale } from "./scale";
import type {
  FixedPrecisionLike,
  FixedPrecisionValue,
  RoundingMode,
} from "./types";

export function roundToScale(
  value: FixedPrecisionValue,
  places: number,
  rm?: RoundingMode,
): FixedPrecisionLike {
  return scale(value, places, rm);
}
