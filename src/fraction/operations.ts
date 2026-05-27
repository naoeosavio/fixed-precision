export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y > 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

export function getNumeratorAndDenominator(
  value: bigint,
  scale: bigint,
): { numerator: bigint; denominator: bigint } {
  const common = gcd(value, scale);
  return {
    numerator: value / common,
    denominator: scale / common,
  };
}

export function limitDenominator(
  numerator: bigint,
  denominator: bigint,
  maxDenominator: bigint,
): { numerator: bigint; denominator: bigint } {
  if (maxDenominator < 1n) {
    throw new Error("maxDen must be a positive integer");
  }

  if (denominator <= maxDenominator) {
    return { numerator, denominator };
  }

  const sign = numerator < 0n ? -1n : 1n;
  const originalNumerator = numerator < 0n ? -numerator : numerator;
  const originalDenominator = denominator;
  let n = originalNumerator;
  let d = originalDenominator;
  let previousNumerator = 0n;
  let currentNumerator = 1n;
  let previousDenominator = 1n;
  let currentDenominator = 0n;

  while (d !== 0n) {
    const quotient = n / d;
    const nextDenominator = previousDenominator + quotient * currentDenominator;

    if (nextDenominator > maxDenominator) {
      break;
    }

    const nextNumerator = previousNumerator + quotient * currentNumerator;
    previousNumerator = currentNumerator;
    currentNumerator = nextNumerator;
    previousDenominator = currentDenominator;
    currentDenominator = nextDenominator;

    const remainder = n - quotient * d;
    n = d;
    d = remainder;
  }

  const remaining = (maxDenominator - previousDenominator) / currentDenominator;
  const boundNumerator = previousNumerator + remaining * currentNumerator;
  const boundDenominator = previousDenominator + remaining * currentDenominator;
  const best = closerFraction(
    originalNumerator,
    originalDenominator,
    boundNumerator,
    boundDenominator,
    currentNumerator,
    currentDenominator,
  );

  return {
    numerator: best.numerator * sign,
    denominator: best.denominator,
  };
}

function closerFraction(
  originalNumerator: bigint,
  originalDenominator: bigint,
  leftNumerator: bigint,
  leftDenominator: bigint,
  rightNumerator: bigint,
  rightDenominator: bigint,
): { numerator: bigint; denominator: bigint } {
  const leftDistance = absoluteBigInt(
    leftNumerator * originalDenominator - originalNumerator * leftDenominator,
  );
  const rightDistance = absoluteBigInt(
    rightNumerator * originalDenominator - originalNumerator * rightDenominator,
  );

  return leftDistance * rightDenominator <= rightDistance * leftDenominator
    ? { numerator: leftNumerator, denominator: leftDenominator }
    : { numerator: rightNumerator, denominator: rightDenominator };
}

function absoluteBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}
