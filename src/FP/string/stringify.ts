import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { to_string_with_ctx } from "../../core/string/toString";

export function stringify(
  value: FixedPrecisionOperand,
  trimZeros = true,
): string {
  const ctx = resolveContext([value]);
  return to_string_with_ctx(toScaled(value, ctx), ctx, trimZeros);
}
