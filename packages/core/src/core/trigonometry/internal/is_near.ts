export function is_near(
  value: bigint,
  target: bigint,
  tolerance: bigint,
): boolean {
  const diff = value - target;
  return diff <= tolerance && -diff <= tolerance;
}
