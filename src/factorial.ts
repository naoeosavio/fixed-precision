import { factorial_value } from "./combinatorics/factorial";
import FixedPrecision from "./FixedPrecision";

export function factorial(n: number | FixedPrecision): FixedPrecision {
  const ctx = FixedPrecision.resolveContext(
    n instanceof FixedPrecision ? [n] : [],
  );
  const val =
    n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
  return FixedPrecision.fromRawWithContext(
    factorial_value(val) * ctx.SCALE,
    ctx,
  );
}
