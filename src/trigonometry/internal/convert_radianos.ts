export function convert_radianos(
  value: bigint,
  pi: bigint,
  scale: bigint,
): bigint {
  return (value * pi) / (18n * scale);
}
