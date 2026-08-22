import { precision_value } from "../../core/arithmetic/precision";
import { shifted_by_value } from "../../core/arithmetic/shiftedBy";
import type {
  FixedPrecisionOperand,
  RoundingMode,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";
import { stringify } from "./stringify";
import { toFixed } from "./toFixed";

export function toPrecision(
  value: FixedPrecisionOperand,
  sd: number,
  rm?: RoundingMode,
): string {
  const ctx = resolveContext([value]);
  const rawValue = toScaled(value, ctx);
  if (rawValue === 0n) {
    return "0";
  }
  const raw = precision_value(rawValue, sd, rm ?? ctx.roundingMode, ctx);
  if (raw === 0n) return "0";

  const absRaw = raw < 0n ? -raw : raw;
  const digitLength = absRaw.toString().length;
  const places = ctx.places;

  let exp: number;
  if (absRaw >= ctx.SCALE) {
    exp = digitLength - places - 1;
  } else {
    const padLength = places - digitLength;
    exp = -(padLength + 1);
  }

  if (exp < -6 || exp >= sd) {
    const mantissa = fromRawWithContext(shifted_by_value(raw, -exp), ctx);
    const dp = sd - 1;
    let formatted = toFixed(mantissa, dp, rm);
    const expSign = exp > 0 ? "+" : "";
    formatted += `e${expSign}${exp}`;
    return formatted;
  }

  return stringify(fromRawWithContext(raw, ctx))
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}
