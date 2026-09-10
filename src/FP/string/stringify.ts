import { to_string_with_ctx } from "../../core/string/toString";
import {
  type FixedPrecisionOperand,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function stringify(
  value: FixedPrecisionOperand,
  trimZeros = true,
): string {
  const ctx = resolveContextSingle(value);
  return to_string_with_ctx(toScaled(value, ctx), ctx, trimZeros);
}
