import type { FPContext } from "../FixedPrecision";
import { assert_positive } from "./internal/assert_positive";
import { natural_log_work } from "./internal/natural_log_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function natural_log_value(value: bigint, ctx: FPContext): bigint {
  assert_positive(value);
  const work = get_work_context(ctx);
  return from_work_scale(natural_log_work(to_work_scale(value), work));
}
