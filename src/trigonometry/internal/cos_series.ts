import { cordic_sincos } from "./cordic";

export function cos_work(
  value: bigint,
  scale: bigint,
  max_iterations: number,
): bigint {
  if (value === 0n) {
    return scale;
  }
  const [cos] = cordic_sincos(value, scale, max_iterations);
  return cos;
}
