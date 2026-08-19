import { precision_value } from "./arithmetic/precision";
import { shifted_by_value } from "./arithmetic/shiftedBy";
import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { toFixed } from "./toFixed";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "./toString";
import type { FixedPrecisionValue, RoundingMode } from "./types";

export function toPrecision(
  value: FixedPrecisionValue,
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

  return toString(fromRawWithContext(raw, ctx))
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

registerFunction("toPrecision", toPrecision);
