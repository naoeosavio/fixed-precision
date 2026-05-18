import type { FPContext, RoundingMode } from "../../FixedPrecision";

export function absoluteValue(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function roundToScaleValue(
  value: bigint,
  roundingFactor: bigint,
  rm: RoundingMode,
): bigint {
  const q = value / roundingFactor;
  const rem = value % roundingFactor;
  const isPositive = value > 0n;

  switch (rm) {
    case 0:
      return rem === 0n ? q : isPositive ? q + 1n : q - 1n;
    case 1:
      return q;
    case 2:
      return isPositive && rem !== 0n ? q + 1n : q;
    case 3:
      return !isPositive && rem !== 0n ? q - 1n : q;
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
  dp: number | undefined,
  rm: RoundingMode | undefined,
  ctx: FPContext,
): bigint {
  const effDp = dp ?? ctx.places;
  const effRm: RoundingMode = rm === undefined ? ctx.roundingMode : rm;
  if (effDp < 0 || effDp > ctx.places) {
    throw new Error(`Decimal places (dp) must be between 0 and ${ctx.places}`);
  }
  const diff = ctx.places - effDp;
  const factor = 10n ** BigInt(diff);
  const rounded = roundToScaleValue(value, factor, effRm);
  return rounded * factor;
}

export function scaleValue(
  value: bigint,
  newScale: number,
  rm: RoundingMode | undefined,
  ctx: FPContext,
): bigint {
  const effRm: RoundingMode = rm === undefined ? ctx.roundingMode : rm;
  if (newScale < 0 || newScale > ctx.places) {
    throw new Error(`newScale must be between 0 and ${ctx.places}`);
  }
  const diff = ctx.places - newScale;
  const factor = 10n ** BigInt(diff);
  const rounded = roundToScaleValue(value, factor, effRm);
  return rounded * factor;
}

export function shiftedByValue(value: bigint, n: number): bigint {
  const shiftFactor = 10n ** BigInt(Math.abs(n));
  if (n >= 0) {
    return value * shiftFactor;
  }
  if (value % shiftFactor !== 0n) {
    throw new Error("Inexact shift");
  }
  return value / shiftFactor;
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
