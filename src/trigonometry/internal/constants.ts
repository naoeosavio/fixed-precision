export function get_guard_scale(places: number): bigint {
  const exponent = BigInt(Math.max(2, Math.ceil(places * 2 / 5)));
  return 10n ** exponent;
}

export function get_max_iterations(places: number): number {
  return Math.min(80, Math.max(10, places * 4));
}

export const PI =
  "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899";
