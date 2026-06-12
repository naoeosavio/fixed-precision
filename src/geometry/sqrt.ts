export function squareRoot(value: bigint, scale: bigint): bigint {
  if (value < 0n) {
    throw new Error("Square root of negative number");
  }
  if (value === 0n) {
    return 0n;
  }

  const target = value * scale;
  if (target < 2n) {
    return target;
  }

  let current = initialSquareRootGuess(target);
  let next = (current + target / current) >> 1n;

  while (next < current) {
    current = next;
    next = (current + target / current) >> 1n;
  }

  return current;
}

function initialSquareRootGuess(value: bigint): bigint {
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) {
    const approx = Math.trunc(Math.sqrt(asNumber));
    if (approx > 0) {
      const guess = BigInt(approx) + 1n;
      if (guess * guess >= value) {
        return guess;
      }
    }
  }

  const bitLength = value.toString(2).length;
  return 1n << BigInt((bitLength + 1) >> 1);
}

export function cubeRoot(value: bigint, scale: bigint): bigint {
  if (value < 0n) {
    return -cubeRoot(-value, scale);
  }

  if (value === 0n) {
    return 0n;
  }

  const target = value * scale * scale;
  let current = initialCubeRootGuess(target);
  let next = ((current << 1n) + target / (current * current)) / 3n;

  while (next < current) {
    current = next;
    next = ((current << 1n) + target / (current * current)) / 3n;
  }

  while (current * current * current > target) {
    current -= 1n;
  }

  while (true) {
    const candidate = current + 1n;
    if (candidate * candidate * candidate > target) {
      return current;
    }
    current = candidate;
  }
}

function initialCubeRootGuess(value: bigint): bigint {
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) {
    const approx = Math.trunc(Math.cbrt(asNumber));
    if (approx > 0) {
      const guess = BigInt(approx) + 1n;
      if (guess * guess * guess >= value) {
        return guess;
      }
    }
  }

  const bitLength = value.toString(2).length;
  return 1n << BigInt(Math.ceil(bitLength / 3));
}
