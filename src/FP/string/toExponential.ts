import { round } from "../arithmetic/round";
import { shiftedBy } from "../arithmetic/shiftedBy";
import {
  type FixedPrecisionOperand,
  type PlacesOptions,
  resolveContext,
} from "../construction";
import { stringify } from "./stringify";
import { toFixed } from "./toFixed";

export function toExponential(
  value: FixedPrecisionOperand,
  options?: PlacesOptions,
): string {
  const ctx = resolveContext([value]);
  const effDp = options?.places ?? ctx.places;
  const rounded = round(value, {
    places: effDp,
    roundingMode: options?.roundingMode,
  });
  const [int = "", frac = ""] = stringify(rounded).split(".");
  const absInt = int.replace(/^-/, "");
  const exp =
    absInt.length > 1
      ? absInt.length - 1
      : absInt === "0"
        ? -frac.search(/[1-9]/) - 1
        : 0;
  const shifted = shiftedBy(rounded, -exp);
  return `${toFixed(shifted, { places: effDp })}e${exp}`
    .replace(/\.0+e/, "e")
    .replace(/(\.\d+?)0+e/, "$1e");
}
