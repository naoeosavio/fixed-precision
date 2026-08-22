export function reconvert_angle(
  value: bigint,
  scale: bigint,
  pi: bigint,
): bigint {
  return (value * 18n * scale) / pi;
}
