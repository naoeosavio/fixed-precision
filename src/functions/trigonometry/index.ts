import type { FPContext } from "../../FixedPrecision";
import { squareRoot } from "../geometry/sqrt";
import { expValue, naturalLogValue } from "../numeric/transcendental";

const GUARD_SCALE = 100_000_000n;
const MAX_SERIES_ITERATIONS = 80;
const PI =
  "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899";

export function sinValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  return fromWorkScale(
    clampUnit(sinWork(reduced.angle, work.scale), work.scale),
  );
}

export function cosValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  const result = reduced.cosSign * cosWork(reduced.angle, work.scale);
  return fromWorkScale(clampUnit(result, work.scale));
}

export function tanValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  const cosine = reduced.cosSign * cosWork(reduced.angle, work.scale);

  assertNonZero(cosine, "Tangent is undefined when cosine is zero");

  const sine = sinWork(reduced.angle, work.scale);
  return fromWorkScale((sine * work.scale) / cosine);
}

export function secValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  const cosine = reduced.cosSign * cosWork(reduced.angle, work.scale);
  return fromWorkScale(reciprocalWork(cosine, work.scale, "Secant"));
}

export function cscValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  const sine = sinWork(reduced.angle, work.scale);
  return fromWorkScale(reciprocalWork(sine, work.scale, "Cosecant"));
}

export function cotValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  const reduced = reduceAngle(toWorkScale(value), work);
  const sine = sinWork(reduced.angle, work.scale);

  assertNonZero(sine, "Cotangent is undefined when sine is zero");

  const cosine = reduced.cosSign * cosWork(reduced.angle, work.scale);
  return fromWorkScale((cosine * work.scale) / sine);
}

export function asinValue(value: bigint, ctx: FPContext): bigint {
  assertBetweenMinusOneAndOne(value, ctx, "Arcsine");

  const work = makeWorkContext(ctx);
  const input = toWorkScale(value);
  const companion = sqrtOneMinusSquared(input, work.scale);
  return fromWorkScale(atan2Work(input, companion, work));
}

export function acosValue(value: bigint, ctx: FPContext): bigint {
  assertBetweenMinusOneAndOne(value, ctx, "Arccosine");

  const work = makeWorkContext(ctx);
  const input = toWorkScale(value);
  const companion = sqrtOneMinusSquared(input, work.scale);
  return fromWorkScale(atan2Work(companion, input, work));
}

export function atanValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  return fromWorkScale(atanWork(toWorkScale(value), work));
}

export function atan2Value(y: bigint, x: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);
  return fromWorkScale(atan2Work(toWorkScale(y), toWorkScale(x), work));
}

export function acotValue(value: bigint, ctx: FPContext): bigint {
  const work = makeWorkContext(ctx);

  if (value === 0n) {
    return fromWorkScale(work.halfPi);
  }

  return fromWorkScale(
    atanWork(reciprocalRaw(toWorkScale(value), work.scale), work),
  );
}

export function asecValue(value: bigint, ctx: FPContext): bigint {
  assertOutsideMinusOneToOne(value, ctx, "Arcsecant");
  return acosValue((ctx.SCALE * ctx.SCALE) / value, ctx);
}

export function acscValue(value: bigint, ctx: FPContext): bigint {
  assertOutsideMinusOneToOne(value, ctx, "Arccosecant");
  return asinValue((ctx.SCALE * ctx.SCALE) / value, ctx);
}

export function sinhValue(value: bigint, ctx: FPContext): bigint {
  const positive = expValue(value, ctx);
  const negative = expValue(-value, ctx);
  return (positive - negative) / 2n;
}

export function coshValue(value: bigint, ctx: FPContext): bigint {
  const positive = expValue(value, ctx);
  const negative = expValue(-value, ctx);
  return (positive + negative) / 2n;
}

export function tanhValue(value: bigint, ctx: FPContext): bigint {
  const doubled = value * 2n;
  const exponent = expValue(doubled, ctx);
  return ((exponent - ctx.SCALE) * ctx.SCALE) / (exponent + ctx.SCALE);
}

export function sechValue(value: bigint, ctx: FPContext): bigint {
  return reciprocalValue(coshValue(value, ctx), ctx, "Hyperbolic secant");
}

export function cschValue(value: bigint, ctx: FPContext): bigint {
  return reciprocalValue(
    coshDifference(value, ctx),
    ctx,
    "Hyperbolic cosecant",
  );
}

export function cothValue(value: bigint, ctx: FPContext): bigint {
  return reciprocalValue(tanhValue(value, ctx), ctx, "Hyperbolic cotangent");
}

export function asinhValue(value: bigint, ctx: FPContext): bigint {
  const xSquared = multiplyScaled(value, value, ctx.SCALE);
  const root = squareRoot(xSquared + ctx.SCALE, ctx.SCALE);
  return naturalLogValue(value + root, ctx);
}

export function acoshValue(value: bigint, ctx: FPContext): bigint {
  if (value < ctx.SCALE) {
    throw new Error(
      "Hyperbolic arccosine is defined for values greater than or equal to 1",
    );
  }

  const xSquared = multiplyScaled(value, value, ctx.SCALE);
  const root = squareRoot(xSquared - ctx.SCALE, ctx.SCALE);
  return naturalLogValue(value + root, ctx);
}

export function atanhValue(value: bigint, ctx: FPContext): bigint {
  if (value <= -ctx.SCALE || value >= ctx.SCALE) {
    throw new Error(
      "Hyperbolic arctangent is defined for values between -1 and 1",
    );
  }

  const numerator = ctx.SCALE + value;
  const denominator = ctx.SCALE - value;
  const ratio = (numerator * ctx.SCALE) / denominator;
  return naturalLogValue(ratio, ctx) / 2n;
}

export function asechValue(value: bigint, ctx: FPContext): bigint {
  if (value <= 0n || value > ctx.SCALE) {
    throw new Error(
      "Hyperbolic arcsecant is defined for values greater than 0 and less than or equal to 1",
    );
  }

  return acoshValue((ctx.SCALE * ctx.SCALE) / value, ctx);
}

export function acschValue(value: bigint, ctx: FPContext): bigint {
  assertNonZero(value, "Hyperbolic arccosecant is undefined for zero");
  return asinhValue((ctx.SCALE * ctx.SCALE) / value, ctx);
}

export function acothValue(value: bigint, ctx: FPContext): bigint {
  if (value >= -ctx.SCALE && value <= ctx.SCALE) {
    throw new Error(
      "Hyperbolic arccotangent is defined for absolute values greater than 1",
    );
  }

  return atanhValue((ctx.SCALE * ctx.SCALE) / value, ctx);
}

function sinWork(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return 0n;
  }

  const valueSquared = (value * value) / scale;
  let term = value;
  let sum = value;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    const divisor = BigInt(2 * index * (2 * index + 1));
    term = -(term * valueSquared) / (scale * divisor);

    if (term === 0n) {
      break;
    }

    sum += term;
  }

  return sum;
}

function cosWork(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return scale;
  }

  const valueSquared = (value * value) / scale;
  let term = scale;
  let sum = scale;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    const divisor = BigInt((2 * index - 1) * (2 * index));
    term = -(term * valueSquared) / (scale * divisor);

    if (term === 0n) {
      break;
    }

    sum += term;
  }

  return sum;
}

function atan2Work(y: bigint, x: bigint, work: WorkContext): bigint {
  if (x > 0n) {
    return atanWork((y * work.scale) / x, work);
  }

  if (x < 0n) {
    const angle = atanWork((y * work.scale) / x, work);
    return y >= 0n ? angle + work.pi : angle - work.pi;
  }

  if (y > 0n) {
    return work.halfPi;
  }

  if (y < 0n) {
    return -work.halfPi;
  }

  return 0n;
}

function atanWork(value: bigint, work: WorkContext): bigint {
  if (value === 0n) {
    return 0n;
  }

  const sign = value < 0n ? -1n : 1n;
  const absoluteValue = value < 0n ? -value : value;
  const reduced =
    absoluteValue > work.scale
      ? work.halfPi -
        atanReducedWork(reciprocalRaw(absoluteValue, work.scale), work.scale)
      : atanReducedWork(absoluteValue, work.scale);

  return sign * reduced;
}

function atanReducedWork(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return 0n;
  }

  const valueSquared = (value * value) / scale;
  const root = squareRoot(scale + valueSquared, scale);
  const reduced = (value * scale) / (scale + root);
  return 2n * atanSeriesWork(reduced, scale);
}

function atanSeriesWork(value: bigint, scale: bigint): bigint {
  const valueSquared = (value * value) / scale;
  let term = value;
  let sum = value;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    term = -(term * valueSquared) / scale;

    if (term === 0n) {
      break;
    }

    sum += term / BigInt(2 * index + 1);
  }

  return sum;
}

function reduceAngle(value: bigint, work: WorkContext): ReducedAngle {
  let angle = value % work.twoPi;

  if (angle > work.pi) {
    angle -= work.twoPi;
  } else if (angle < -work.pi) {
    angle += work.twoPi;
  }

  if (angle > work.halfPi) {
    return {
      angle: work.pi - angle,
      cosSign: -1n,
    };
  }

  if (angle < -work.halfPi) {
    return {
      angle: -work.pi - angle,
      cosSign: -1n,
    };
  }

  return {
    angle,
    cosSign: 1n,
  };
}

function makeWorkContext(ctx: FPContext): WorkContext {
  const scale = ctx.SCALE * GUARD_SCALE;
  const pi = scaledDecimal(PI, scale);

  return {
    scale,
    pi,
    halfPi: pi / 2n,
    twoPi: pi * 2n,
  };
}

function toWorkScale(value: bigint): bigint {
  return value * GUARD_SCALE;
}

function fromWorkScale(value: bigint): bigint {
  return value / GUARD_SCALE;
}

function sqrtOneMinusSquared(value: bigint, scale: bigint): bigint {
  const squared = multiplyScaled(value, value, scale);
  return squareRoot(scale - squared, scale);
}

function multiplyScaled(left: bigint, right: bigint, scale: bigint): bigint {
  return (left * right) / scale;
}

function reciprocalValue(value: bigint, ctx: FPContext, name: string): bigint {
  assertNonZero(value, `${name} is undefined for zero`);
  return (ctx.SCALE * ctx.SCALE) / value;
}

function reciprocalWork(value: bigint, scale: bigint, name: string): bigint {
  assertNonZero(value, `${name} is undefined for zero`);
  return reciprocalRaw(value, scale);
}

function reciprocalRaw(value: bigint, scale: bigint): bigint {
  return (scale * scale) / value;
}

function coshDifference(value: bigint, ctx: FPContext): bigint {
  const positive = expValue(value, ctx);
  const negative = expValue(-value, ctx);
  return (positive - negative) / 2n;
}

function clampUnit(value: bigint, scale: bigint): bigint {
  if (value > scale) {
    return scale;
  }

  if (value < -scale) {
    return -scale;
  }

  return value;
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

function assertBetweenMinusOneAndOne(
  value: bigint,
  ctx: FPContext,
  name: string,
): void {
  if (value < -ctx.SCALE || value > ctx.SCALE) {
    throw new Error(`${name} is defined for values between -1 and 1`);
  }
}

function assertOutsideMinusOneToOne(
  value: bigint,
  ctx: FPContext,
  name: string,
): void {
  if (value > -ctx.SCALE && value < ctx.SCALE) {
    throw new Error(
      `${name} is defined for absolute values greater than or equal to 1`,
    );
  }
}

function assertNonZero(value: bigint, message: string): void {
  if (value === 0n) {
    throw new Error(message);
  }
}

type ReducedAngle = {
  angle: bigint;
  cosSign: 1n | -1n;
};

type WorkContext = {
  scale: bigint;
  pi: bigint;
  halfPi: bigint;
  twoPi: bigint;
};
