import { round } from "../arithmetic/round";
import { shiftedBy } from "../arithmetic/shiftedBy";
import {
  type FixedPrecisionOperand,
  type PlacesOptions,
  resolveContextSingle,
  toScaled,
} from "../construction";
import { toFixed } from "./toFixed";

export function toExponential(
  value: FixedPrecisionOperand,
  options?: PlacesOptions,
): string {
  const ctx = resolveContextSingle(value);
  const effDp = options?.places ?? ctx.places;
  const rm = options?.roundingMode ?? ctx.roundingMode;
  const raw = toScaled(value, ctx);

  if (raw === 0n) {
    return effDp === 0 ? "0e+0" : `0.${"0".repeat(effDp)}e+0`;
  }

  const negative = raw < 0n;
  const absRaw = negative ? -raw : raw;
  const digits = absRaw.toString();
  const padded = digits.padStart(ctx.places + 1, "0");
  const decimalPos = padded.length - ctx.places - 1;
  let firstSignificant = 0;
  while (padded[firstSignificant] === "0") {
    firstSignificant += 1;
  }
  const exp = decimalPos - firstSignificant;

  let mantissa = shiftedBy(negative ? -absRaw : absRaw, -exp);
  if (effDp <= ctx.places) {
    mantissa = round(mantissa, { places: effDp, roundingMode: rm });
  }

  const ten = 10n * BigInt(10) ** BigInt(ctx.places);
  const mantissaRaw = toScaled(mantissa, ctx);
  if (mantissaRaw >= ten || mantissaRaw <= -ten) {
    mantissa = shiftedBy(mantissa, -1);
    return `${toFixed(mantissa, { places: effDp, roundingMode: rm })}e+${exp + 1}`;
  }

  return `${toFixed(mantissa, { places: effDp, roundingMode: rm })}e${
    exp >= 0 ? "+" : ""
  }${exp}`;
}
