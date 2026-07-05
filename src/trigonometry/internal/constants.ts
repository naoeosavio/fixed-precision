export function get_guard_scale(places: number): {
  guard: number;
  guard_scale: bigint;
} {
  const exponent = places == 16 ? 3 : 2;
  return { guard: exponent, guard_scale: BigInt(10 ** exponent) };
}

export function get_max_iterations(places: number): number {
  return Math.min(60, Math.max(10, places * 3));
}

export const PI =
  "314159265358979323846264338327950288419716939937510582097494459230781640628620899";
