import type { FPContext } from "../../construction/types";
import { GUARD_SCALE, LN2 } from "./ln_constants";

const LN2_NUM = 0.6931471805599453;
const LOG10_E = 0.4342944819032518;
const LN2_FRACTION_DIGITS = LN2.length - 2;
const MAX_GUARD_DIGITS = LN2_FRACTION_DIGITS - 30;

export function exp_guard(value: bigint, ctx: FPContext): bigint {
  if (value <= 0n) return GUARD_SCALE;

  const x = Number(value) / Number(ctx.SCALE);
  if (!Number.isFinite(x)) {
    throw new Error("exp() overflow: argument is too large");
  }

  const result_digits = Math.ceil(x * LOG10_E) + 1;
  const exponent_digits = Math.max(0, Math.ceil(Math.log10(x / LN2_NUM)));
  const guard_digits = result_digits + exponent_digits + 2;

  if (guard_digits > MAX_GUARD_DIGITS) {
    throw new Error(
      "exp() overflow: argument exceeds the maximum supported magnitude (around 1e+1000)",
    );
  }

  return GUARD_SCALE * 10n ** BigInt(guard_digits);
}
