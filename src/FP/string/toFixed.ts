import { scale } from "../arithmetic/scale";
import {
  type FixedPrecisionOperand,
  type PlacesOptions,
} from "../construction";
import { stringify } from "./stringify";

export function toFixed(
  value: FixedPrecisionOperand,
  options?: PlacesOptions,
): string {
  return stringify(
    scale(value, {
      places: options?.places ?? 0,
      roundingMode: options?.roundingMode,
    }),
    false,
  );
}
