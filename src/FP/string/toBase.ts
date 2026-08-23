import { to_base_with_ctx } from "../../core/string/toBase";
import {
  type FixedPrecisionOperand,
  resolveContext,
  type SdOptions,
  toScaled,
} from "../construction";

export function toBase(
  value: FixedPrecisionOperand,
  base: 2 | 8 | 16,
  options?: SdOptions,
): string {
  const ctx = resolveContext([value]);
  return to_base_with_ctx(
    toScaled(value, ctx),
    ctx,
    base,
    options?.sd,
    options?.roundingMode,
  );
}
