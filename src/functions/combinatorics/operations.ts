export function factorialValue(n: number): bigint {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial is only defined for non-negative integers");
  }
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

export function permutationsValue(n: number, k: number): bigint {
  if (n < 0 || !Number.isInteger(n) || k < 0 || !Number.isInteger(k)) {
    throw new Error("Permutations are only defined for non-negative integers");
  }
  if (k > n) return 0n;
  let result = 1n;
  for (let i = BigInt(n - k + 1); i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

export function combinationsValue(n: number, k: number): bigint {
  if (n < 0 || !Number.isInteger(n) || k < 0 || !Number.isInteger(k)) {
    throw new Error("Combinations are only defined for non-negative integers");
  }
  if (k > n) return 0n;
  let targetK = k;
  if (targetK * 2 > n) {
    targetK = n - targetK;
  }
  let result = 1n;
  for (let i = 1n; i <= BigInt(targetK); i++) {
    result = (result * (BigInt(n) - i + 1n)) / i;
  }
  return result;
}
