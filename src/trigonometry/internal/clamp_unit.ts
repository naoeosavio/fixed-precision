export function clamp_unit(value: bigint, scale: bigint): bigint {
  if (value > scale) {
    return scale;
  }

  if (value < -scale) {
    return -scale;
  }

  return value;
}
