import type { FPContext } from "../FixedPrecision";

const GUARD_SCALE = 1000n;
const MAX_SERIES_ITERATIONS = 160n;
const LN2 =
  "0.69314718055994530941723212145817656807550013436025525412068000949339362196969472";
const LN10 =
  "2.30258509299404568401799145468436420760110148862877297603332790096757260967735248";

export function naturalLogValue(value: bigint, ctx: FPContext): bigint {
  assertPositive(value);
  const work = makeWorkContext(ctx);
  return fromWorkScale(naturalLogWork(toWorkScale(value), work));
}

export function logValue(value: bigint, base: bigint, ctx: FPContext): bigint {
  assertPositive(value);
  assertValidBase(base, ctx);

  const work = makeWorkContext(ctx);
  const numerator = naturalLogWork(toWorkScale(value), work);
  const denominator = naturalLogWork(toWorkScale(base), work);
  if (denominator === 0n) {
    throw new Error("Logarithm base must be positive and not equal to 1");
  }

  return fromWorkScale((numerator * work.scale) / denominator);
}

export function log10Value(value: bigint, ctx: FPContext): bigint {
  assertPositive(value);
  const exact = exactPowerOfTenLog(value, ctx.SCALE);
  if (exact !== undefined) {
    return exact;
  }

  const work = makeWorkContext(ctx);
  const result =
    (naturalLogWork(toWorkScale(value), work) * work.scale) / work.ln10;
  return fromWorkScale(result);
}

export function log2Value(value: bigint, ctx: FPContext): bigint {
  assertPositive(value);
  const work = makeWorkContext(ctx);
  const result =
    (naturalLogWork(toWorkScale(value), work) * work.scale) / work.ln2;
  return fromWorkScale(result);
}

export function expValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  return fromWorkScale(expWork(toWorkScale(value), work));
}

function naturalLogWork(value: bigint, work: WorkContext): bigint {
  let normalized = value;
  let exponent = 0n;
  const upperBound = work.scale * 2n;

  while (normalized >= upperBound) {
    normalized /= 2n;
    exponent += 1n;
  }

  while (normalized < work.scale) {
    normalized *= 2n;
    exponent -= 1n;
  }

  return exponent * work.ln2 + naturalLogOneToTwo(normalized, work.scale);
}

function naturalLogOneToTwo(value: bigint, scale: bigint): bigint {
  const z = ((value - scale) * scale) / (value + scale);
  const zSquared = (z * z) / scale;
  let term = z;
  let sum = 0n;
  let divisor = 1n;

  for (
    let index = 0n;
    index < MAX_SERIES_ITERATIONS && term !== 0n;
    index += 1n
  ) {
    sum += term / divisor;
    term = (term * zSquared) / scale;
    divisor += 2n;
  }

  return sum * 2n;
}

function expWork(value: bigint, work: WorkContext): bigint {
  const exponent = divideRounded(value, work.ln2);
  const reduced = value - exponent * work.ln2;
  let result = expReducedWork(reduced, work.scale);

  if (exponent > 0n) {
    result <<= exponent;
  } else if (exponent < 0n) {
    result >>= -exponent;
  }

  return result;
}

function expReducedWork(value: bigint, scale: bigint): bigint {
  let sum = scale;
  let term = scale;

  for (let divisor = 1n; divisor <= MAX_SERIES_ITERATIONS; divisor += 1n) {
    term = (term * value) / (scale * divisor);
    if (term === 0n) {
      break;
    }
    sum += term;
  }

  return sum;
}

function divideRounded(value: bigint, divisor: bigint): bigint {
  if (value >= 0n) {
    return (value + divisor / 2n) / divisor;
  }
  return -((-value + divisor / 2n) / divisor);
}

function makeWorkContext(ctx: FPContext): WorkContext {
  const scale = ctx.SCALE * GUARD_SCALE;
  return {
    scale,
    ln2: scaledDecimal(LN2, scale),
    ln10: scaledDecimal(LN10, scale),
  };
}

function toWorkScale(value: bigint): bigint {
  return value * GUARD_SCALE;
}

function fromWorkScale(value: bigint): bigint {
  return value / GUARD_SCALE;
}

function scaledDecimal(value: string, scale: bigint): bigint {
  const [integerPart = "0", fractionPart = ""] = value.split(".");
  const scaleDigits = scale.toString().length - 1;
  const fraction = `${fractionPart}${"0".repeat(scaleDigits)}`.slice(
    0,
    scaleDigits,
  );
  return BigInt(integerPart) * scale + BigInt(fraction || "0");
}

function assertPositive(value: bigint): void {
  if (value <= 0n) {
    throw new Error("Logarithm is undefined for non-positive values");
  }
}

function assertValidBase(base: bigint, ctx: FPContext): void {
  if (base <= 0n || base === ctx.SCALE) {
    throw new Error("Logarithm base must be positive and not equal to 1");
  }
}

function exactPowerOfTenLog(value: bigint, scale: bigint): bigint | undefined {
  if (value === scale) {
    return 0n;
  }

  if (value > scale) {
    if (value % scale !== 0n) {
      return undefined;
    }
    const exponent = countPowerOfTen(value / scale);
    return exponent === undefined ? undefined : exponent * scale;
  }

  if (scale % value !== 0n) {
    return undefined;
  }

  const exponent = countPowerOfTen(scale / value);
  return exponent === undefined ? undefined : -exponent * scale;
}

function countPowerOfTen(value: bigint): bigint | undefined {
  let current = value;
  let exponent = 0n;

  while (current > 1n && current % 10n === 0n) {
    current /= 10n;
    exponent += 1n;
  }

  return current === 1n ? exponent : undefined;
}

type WorkContext = {
  scale: bigint;
  ln2: bigint;
  ln10: bigint;
};
