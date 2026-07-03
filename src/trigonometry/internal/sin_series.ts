import { cordic_sincos } from "./cordic";

export function sin_work(
  value: bigint,
  scale: bigint,
  max_iterations: number,
): bigint {
  if (value === 0n) {
    return 0n;
  }
  const [, sin] = cordic_sincos(value, scale, max_iterations);
  return sin;
}
