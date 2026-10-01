import type { FPContext } from "../../../FixedPrecision";
import { cos_series } from "../internal/cos_series";
import { is_near } from "../internal/is_near";
import { reciprocal_work } from "../internal/reciprocal_work";
import { reduce_angle_quadrant_cos } from "../internal/reduce_angle_quadrant_cos";
import { from_work_scale } from "../internal/scale_utils";
import { get_work_context } from "../internal/work_context";

const ANGLE_TOLERANCE = 1n;

export function csc_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle_quadrant_cos(value, work, false);
  const angle = reduced.angle / work.reduction_unit;

  if (angle === 0n) {
    return reduced.sign * ctx.SCALE;
  }

  if (is_near(angle, work.weak_pi >> 1n, ANGLE_TOLERANCE)) {
    throw new Error("Cosecant is undefined when sine is zero");
  }

  if (is_near(angle, work.weak_pi / 3n, ANGLE_TOLERANCE)) {
    return reduced.sign * (ctx.SCALE * 2n);
  }

  const angle_work = angle * work.guard_scale;

  const result = cos_series(angle_work, work.scale, work.max_iterations);
  return (
    reduced.sign *
    from_work_scale(
      reciprocal_work(result, work.scale, "Cosecant"),
      work.guard_scale,
    )
  );
}
