import { registerFunction, resolveContext } from "./core/value";
import { round } from "./round";
import { shiftedBy } from "./shiftedBy";
import { toFixed } from "./toFixed";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "./toString";
import type { FixedPrecisionValue, RoundingMode } from "./types";

export function toExponential(
  value: FixedPrecisionValue,
  dp?: number,
  rm?: RoundingMode,
): string {
  const ctx = resolveContext([value]);
  const effDp = dp ?? ctx.places;
  const rounded = round(value, effDp, rm);
  const [int = "", frac = ""] = toString(rounded).split(".");
  const absInt = int.replace(/^-/, "");
  const exp =
    absInt.length > 1
      ? absInt.length - 1
      : absInt === "0"
        ? -frac.search(/[1-9]/) - 1
        : 0;
  const shifted = shiftedBy(rounded, -exp);
  return `${toFixed(shifted, effDp)}e${exp}`
    .replace(/\.0+e/, "e")
    .replace(/(\.\d+?)0+e/, "$1e");
}

registerFunction("toExponential", toExponential);
