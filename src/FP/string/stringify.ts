import { to_string_with_ctx } from "../../core/string/toString";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function stringify(
  value: FixedPrecisionOperand,
  trimZeros = true,
): string {
  const ctx = resolveContext([value]);
  return to_string_with_ctx(toScaled(value, ctx), ctx, trimZeros);
}
