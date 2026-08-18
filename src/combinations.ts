import FixedPrecision from "./FixedPrecision";

export function combinations(
  n: number | FixedPrecision,
  k: number | FixedPrecision,
): FixedPrecision {
  return FixedPrecision.combinations(n, k);
}
