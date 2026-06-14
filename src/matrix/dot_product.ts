export function dot_product(a: bigint[], b: bigint[], scale: bigint): bigint {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }
  if (a.length === 0) {
    return 0n;
  }
  let sum = 0n;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] * b[i]) / scale;
  }
  return sum;
}
