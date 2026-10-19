export function power_by_squaring(
  value: bigint,
  exp: number,
  scale: bigint,
): bigint {
  let e = exp;
  let base = value;
  let acc = scale;

  while (e > 0) {
    if (e & 1) acc = (acc * base) / scale;
    e = e >> 1;
    if (e > 0) {
      base = (base * base) / scale;
    }
  }

  return acc;
}
