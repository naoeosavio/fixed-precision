import type { FPContext } from "../FixedPrecision";
import { clamp_unit } from "./internal/clamp_unit";
import { cos_work } from "./internal/cos_series";
import { reduce_angle } from "./internal/reduce_angle";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function cos_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value, work.guard_scale), work);
  const result =
    reduced.cos_sign * cos_work(reduced.angle, work.scale, work.max_iterations);
  return from_work_scale(clamp_unit(result, work.scale), work.guard_scale);
}
