import type { FPContext, RoundingMode } from "../../FixedPrecision";
import { powerOfTen } from "../utils";

export function roundToScaleValue(
  value: bigint,
  roundingFactor: bigint,
  rm: RoundingMode,
): bigint {
  const q = value / roundingFactor;
  if (rm === 1) {
    return q;
  }

  const rem = value - q * roundingFactor;
  if (rem === 0n) {
    return q;
  }

  const isPositive = value > 0n;

  switch (rm) {
    case 0:
      return isPositive ? q + 1n : q - 1n;
    case 2:
      return isPositive ? q + 1n : q;
    case 3:
      return !isPositive ? q - 1n : q;
    case 4:
    case 5:
    case 7:
      return roundHalf(q, rem, roundingFactor, isPositive, rm);
    case 6:
      return roundHalfEven(q, rem, roundingFactor, isPositive);
    case 8:
      return roundHalfFloor(q, rem, roundingFactor, isPositive);
    default:
      throw new Error(`Rounding mode ${rm} is not supported.`);
  }
}

export function roundValue(
  value: bigint,
  dp: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  if (dp < 0 || dp > ctx.places) {
    throw new Error(`Decimal places (dp) must be between 0 and ${ctx.places}`);
  }
  const diff = ctx.places - dp;
  const factor = powerOfTen(diff);
  if (rm === 4) {
    return roundHalfUpScaledValue(value, factor);
  }
  return roundToScaleValue(value, factor, rm) * factor;
}

export function scaleValue(
  value: bigint,
  newPlaces: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  if (!Number.isInteger(newPlaces) || newPlaces < 0 || newPlaces > 20) {
    throw new Error("newScale must be an integer between 0 and 20");
  }

  if (newPlaces === ctx.places) {
    return value;
  }

  if (newPlaces > ctx.places) {
    return value * powerOfTen(newPlaces - ctx.places);
  }

  const factor = powerOfTen(ctx.places - newPlaces);
  return roundToScaleValue(value, factor, rm);
}

export function shiftedByValue(value: bigint, n: number): bigint {
  if (!Number.isInteger(n)) {
    throw new Error("shift must be an integer");
  }
  return value >> BigInt(n);
}

function roundHalfUpScaledValue(value: bigint, factor: bigint): bigint {
  const q = value / factor;
  const base = q * factor;
  const rem = value - base;
  if (rem === 0n) {
    return value;
  }

  const twiceAbsRem = rem < 0n ? -rem * 2n : rem * 2n;
  if (twiceAbsRem < factor) {
    return base;
  }
  return value > 0n ? base + factor : base - factor;
}

function roundHalf(
  q: bigint,
  rem: bigint,
  factor: bigint,
  isPositive: boolean,
  rm: RoundingMode,
): bigint {
  const twiceAbsRem = 2n * (rem < 0n ? -rem : rem);

  if (rm === 7) {
    return isPositive && twiceAbsRem >= factor ? q + 1n : q;
  }

  const shouldRound = rm === 4 ? twiceAbsRem >= factor : twiceAbsRem > factor;
  return shouldRound ? (isPositive ? q + 1n : q - 1n) : q;
}

function roundHalfEven(
  q: bigint,
  rem: bigint,
  factor: bigint,
  isPositive: boolean,
): bigint {
  const twiceAbsRem = 2n * (rem < 0n ? -rem : rem);
  if (twiceAbsRem === factor) {
    return q % 2n === 0n ? q : isPositive ? q + 1n : q - 1n;
  }
  return twiceAbsRem > factor ? (isPositive ? q + 1n : q - 1n) : q;
}

function roundHalfFloor(
  q: bigint,
  rem: bigint,
  factor: bigint,
  isPositive: boolean,
): bigint {
  const twiceAbsRem = 2n * (rem < 0n ? -rem : rem);
  if (isPositive) {
    return twiceAbsRem > factor ? q + 1n : q;
  }
  return twiceAbsRem >= factor ? q - 1n : q;
}
