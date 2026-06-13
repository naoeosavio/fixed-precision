import type { FPContext } from "../FixedPrecision";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reduce_angle } from "./internal/reduce_angle";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_work } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function csc_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value), work);
  const sine = sin_work(reduced.angle, work.scale);
  return from_work_scale(reciprocal_work(sine, work.scale, "Cosecant"));
}
