import type { FPContext } from "../../FixedPrecision";

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

  if (cosine === 0n) {
    throw new Error("Tangent is undefined when cosine is zero");
  }

  const sine = sinWork(reduced.angle, work.scale);
  return fromWorkScale((sine * work.scale) / cosine);
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
