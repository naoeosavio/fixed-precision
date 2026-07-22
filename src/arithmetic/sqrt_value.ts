export function sqrt_value(x: bigint, scale: bigint): bigint {
  if (x < 0n) throw new Error("Square root of negative number");
  if (x === 0n) return 0n;
  if (x === scale) return scale;

  const target = x * scale;
  if (target < 2n) {
    return target;
  }

  let current = target >> 1n;
  if (current === 0n) current = 1n;

  while (true) {
    const next = (current + target / current) >> 1n;
    if (next >= current) return current;
    current = next;
  }
}
