import type { FPContext } from "../FixedPrecision";
import { assert_positive } from "./internal/assert_positive";
import { assert_valid_base } from "./internal/assert_valid_base";
import { natural_log_work } from "./internal/natural_log_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function log_value(value: bigint, base: bigint, ctx: FPContext): bigint {
  assert_positive(value);
  assert_valid_base(base, ctx);

  const work = get_work_context(ctx);
  const numerator = natural_log_work(to_work_scale(value), work);
  const denominator = natural_log_work(to_work_scale(base), work);
  if (denominator === 0n) {
    throw new Error("Logarithm base must be positive and not equal to 1");
  }

  return from_work_scale((numerator * work.scale) / denominator);
}
