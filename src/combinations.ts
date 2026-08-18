import { combinations_value } from "./combinatorics/combinations";
import FixedPrecision from "./FixedPrecision";

export function combinations(
  n: number | FixedPrecision,
  k: number | FixedPrecision,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext(
    n instanceof FixedPrecision ? [n] : [],
  );
  const valN =
    n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
  const valK =
    k instanceof FixedPrecision ? k.trunc().toNumber() : Math.trunc(k);
  return FixedPrecision.fromRawWithContext(
    combinations_value(valN, valK) * ctx.SCALE,
    ctx,
  );
}
