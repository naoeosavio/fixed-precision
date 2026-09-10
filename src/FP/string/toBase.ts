import { to_base_with_ctx } from "../../core/string/toBase";
import {
  type FixedPrecisionOperand,
  resolveContextSingle,
  type SdOptions,
  toScaled,
} from "../construction";

export function toBase(
  value: FixedPrecisionOperand,
  base: 2 | 8 | 16,
  options?: SdOptions,
): string {
  const ctx = resolveContextSingle(value);
  return to_base_with_ctx(
    toScaled(value, ctx),
    ctx,
    base,
    options?.sd,
    options?.roundingMode,
  );
}
