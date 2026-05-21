import type { FPContext, RoundingMode } from "../../FixedPrecision";
import { roundToScaleValue } from "../numeric/rounding";
import { powerOfTen } from "../utils";

export function toStringWithCtx(value: bigint, ctx: FPContext): string {
  const P = ctx.places;

  if (P === 0) return value.toString();

  const str = value.toString();
  const isNegative = str[0] === "-";
  const absStr = isNegative ? str.slice(1) : str;
  const len = absStr.length;

  if (len <= P) {
    const padded = absStr.padStart(P + 1, "0");
    const intPart = padded.slice(0, padded.length - P);
    const fracPart = padded.slice(-P);
    return `${(isNegative ? "-" : "") + intPart}.${fracPart}`;
  }

  const intPart = absStr.slice(0, len - P);
  const fracPart = absStr.slice(-P);
  return `${(isNegative ? "-" : "") + intPart}.${fracPart}`;
}

export function toFixedWithCtx(
  value: bigint,
  ctx: FPContext,
  places = 0,
  rm?: RoundingMode,
): string {
  const decPlaces = places !== undefined ? places : ctx.places;
  if (decPlaces < 0 || decPlaces > ctx.places) {
    throw new Error(`places must be between 0 and ${ctx.places}`);
  }
  const diff = ctx.places - decPlaces;
  const roundingFactor = powerOfTen(diff);
  const effRm: RoundingMode = rm === undefined ? ctx.roundingMode : rm;
  const scaled = roundToScaleValue(value, roundingFactor, effRm);
  const divisor = powerOfTen(decPlaces);
  const intPart = scaled / divisor;
  const rem = scaled - intPart * divisor;
  const fracPart = rem.toString().padStart(decPlaces, "0");
  return decPlaces > 0
    ? `${intPart.toString()}.${fracPart}`
    : intPart.toString();
}
