import type { FPContext, RoundingMode } from "../FixedPrecision";
import { roundToScaleValue } from "../numeric/rounding";

const BASE_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

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

export function toBaseWithCtx(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  if (sd !== undefined) {
    return toBaseWithSignificantDigits(value, ctx, radix, sd, rm);
  }

  return toBaseWithDefaultFractionDigits(value, ctx, radix);
}

function toBaseWithDefaultFractionDigits(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
): string {
  if (value === 0n) {
    return "0";
  }

  const sign = value < 0n ? "-" : "";
  const absValue = value < 0n ? -value : value;
  const integerPart = absValue / ctx.SCALE;
  let remainder = absValue - integerPart * ctx.SCALE;
  const fractionalDigits: string[] = [];
  const base = BigInt(radix);

  for (let index = 0; index < ctx.places && remainder !== 0n; index += 1) {
    remainder *= base;
    const digit = remainder / ctx.SCALE;
    fractionalDigits.push(BASE_DIGITS[Number(digit)] ?? "0");
    remainder -= digit * ctx.SCALE;
  }

  while (fractionalDigits[fractionalDigits.length - 1] === "0") {
    fractionalDigits.pop();
  }

  const integerString = integerPart.toString(radix);
  return fractionalDigits.length === 0
    ? `${sign}${integerString}`
    : `${sign}${integerString}.${fractionalDigits.join("")}`;
}

function toBaseWithSignificantDigits(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
  sd: number,
  rm?: RoundingMode,
): string {
  assertSignificantDigits(sd);

  if (value === 0n) {
    return "0";
  }

  const exponent = baseExponent(value, ctx.SCALE, radix);
  const unitExponent = exponent - sd + 1;
  const roundingMode = rm ?? ctx.roundingMode;

  if (unitExponent >= 0) {
    const unit = ctx.SCALE * basePower(radix, unitExponent);
    const quotient = roundToScaleValue(value, unit, roundingMode);
    return ((quotient * unit) / ctx.SCALE).toString(radix);
  }

  const fractionalPlaces = -unitExponent;
  const baseScale = basePower(radix, fractionalPlaces);
  const quotient = roundToScaleValue(
    value * baseScale,
    ctx.SCALE,
    roundingMode,
  );
  return formatBaseQuotient(quotient, radix, fractionalPlaces);
}

function formatBaseQuotient(
  quotient: bigint,
  radix: 2 | 8 | 16,
  fractionalPlaces: number,
): string {
  const sign = quotient < 0n ? "-" : "";
  const absQuotient = quotient < 0n ? -quotient : quotient;
  const baseScale = basePower(radix, fractionalPlaces);
  const integerPart = absQuotient / baseScale;
  const fractionalPart = absQuotient - integerPart * baseScale;

  if (fractionalPart === 0n) {
    return `${sign}${integerPart.toString(radix)}`;
  }

  const fractionalDigits = fractionalPart
    .toString(radix)
    .padStart(fractionalPlaces, "0")
    .replace(/0+$/, "");

  return `${sign}${integerPart.toString(radix)}.${fractionalDigits}`;
}

function baseExponent(value: bigint, scale: bigint, radix: 2 | 8 | 16): number {
  const absValue = value < 0n ? -value : value;
  const integerPart = absValue / scale;

  if (integerPart > 0n) {
    return integerPart.toString(radix).length - 1;
  }

  let scaled = absValue;
  let exponent = 0;
  const base = BigInt(radix);

  while (scaled < scale) {
    scaled *= base;
    exponent -= 1;
  }

  return exponent;
}

function basePower(radix: 2 | 8 | 16, exponent: number): bigint {
  return BigInt(radix) ** BigInt(exponent);
}

function assertSignificantDigits(sd: number): void {
  if (!Number.isInteger(sd) || sd < 1 || sd >= 1e6) {
    throw new Error("Invalid precision");
  }
}
