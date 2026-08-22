import type {
  FixedPrecisionOperand,
  RoundingMode,
} from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { to_base_with_ctx } from "../../core/string/toBase";

export function toBase(
  value: FixedPrecisionOperand,
  base: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  const ctx = resolveContext([value]);
  return to_base_with_ctx(toScaled(value, ctx), ctx, base, sd, rm);
}
