import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
  RoundingMode,
} from "../../core/construction/types";
import { scale } from "./scale";

export function roundToScale(
  value: FixedPrecisionOperand,
  places: number,
  rm?: RoundingMode,
): FixedPrecisionData {
  return scale(value, places, rm);
}
