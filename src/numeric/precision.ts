import type { FPContext, RoundingMode } from "../FixedPrecision";
import { precisionPowerOfTen } from "../utils";
import { roundToScaleValue } from "./rounding";

export function precisionValue(
  value: bigint,
  sd: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  assertSignificantDigits(sd);

  if (value === 0n) {
    return 0n;
  }

  const absValue = value < 0n ? -value : value;
  const decimalExponent = absValue.toString().length - ctx.places - 1;
  const roundingExponent = ctx.places + decimalExponent - sd + 1;
  if (roundingExponent <= 0) {
    return value;
  }

  const factor = precisionPowerOfTen(roundingExponent);
  return roundToScaleValue(value, factor, rm) * factor;
}

function assertSignificantDigits(sd: number): void {
  if (!Number.isInteger(sd) || sd < 1 || sd >= 1e6) {
    throw new Error("Precision must be a positive integer");
  }
}

export function significantDigitsValue(
  value: bigint,
  ctx: FPContext,
  includeZeros = false,
): number {
  const absValue = value < 0n ? -value : value;
  if (absValue === 0n) {
    return 1;
  }

  const integerPart = absValue / ctx.SCALE;
  const fractionalPart = absValue - integerPart * ctx.SCALE;

  if (fractionalPart === 0n) {
    const integerDigits = integerPart.toString();
    return includeZeros
      ? integerDigits.length
      : trimTrailingZeros(integerDigits).length;
  }

  const fractionalDigits = trimTrailingZeros(
    fractionalPart.toString().padStart(ctx.places, "0"),
  );

  if (integerPart === 0n) {
    return fractionalDigits.replace(/^0+/, "").length;
  }

  return integerPart.toString().length + fractionalDigits.length;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/0+$/, "");
}
