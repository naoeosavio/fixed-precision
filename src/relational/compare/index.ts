import type { Comparison } from "../../FixedPrecision";

export function compareValues(left: bigint, right: bigint): Comparison {
  return left < right ? -1 : left > right ? 1 : 0;
}
