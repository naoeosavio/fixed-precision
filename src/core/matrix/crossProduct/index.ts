export function cross_product(
  a: bigint[],
  b: bigint[],
  scale: bigint,
): bigint[] {
  if (a.length !== 3 || b.length !== 3) {
    throw new Error("Cross product is only defined for 3D vectors");
  }
  const x = (a[1] * b[2] - a[2] * b[1]) / scale;
  const y = (a[2] * b[0] - a[0] * b[2]) / scale;
  const z = (a[0] * b[1] - a[1] * b[0]) / scale;
  return [x, y, z];
}
