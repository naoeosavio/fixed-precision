export function permutations_value(n: number, k: number): bigint {
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
