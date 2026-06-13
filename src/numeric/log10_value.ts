import type { FPContext } from "../FixedPrecision";
import { assert_positive } from "./internal/assert_positive";
import { exact_power_of_ten_log } from "./internal/exact_power_of_ten_log";
import { natural_log_work } from "./internal/natural_log_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function log10_value(value: bigint, ctx: FPContext): bigint {
  assert_positive(value);
  const exact = exact_power_of_ten_log(value, ctx.SCALE);
  if (exact !== undefined) {
    return exact;
  }

  const work = get_work_context(ctx);
  const result =
    (natural_log_work(to_work_scale(value), work) * work.scale) / work.ln10;
  return from_work_scale(result);
}
