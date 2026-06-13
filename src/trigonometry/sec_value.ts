import type { FPContext } from "../FixedPrecision";
import { cos_work } from "./internal/cos_series";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reduce_angle } from "./internal/reduce_angle";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function sec_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value), work);
  const cosine = reduced.cos_sign * cos_work(reduced.angle, work.scale);
  return from_work_scale(reciprocal_work(cosine, work.scale, "Secant"));
}
