export function combinations_value(n: number, k: number): bigint {
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
