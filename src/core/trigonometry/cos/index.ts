import type { FPContext } from "../../../FixedPrecision";
import { cos_series } from "../internal/cos_series";
import { is_near } from "../internal/is_near";
import { reduce_angle_quadrant_cos } from "../internal/reduce_angle_quadrant_cos";
import { from_work_scale } from "../internal/scale_utils";
import { get_work_context } from "../internal/work_context";

const ANGLE_TOLERANCE = 1n;

export function cos_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle_quadrant_cos(value, work, true);
  const angle = reduced.angle / work.reduction_unit;
  if (
    is_near(angle, 0n, ANGLE_TOLERANCE) ||
    is_near(angle, work.weak_pi, ANGLE_TOLERANCE)
  ) {
    return ctx.SCALE * reduced.sign;
  }

  if (is_near(angle, work.weak_pi >> 1n, ANGLE_TOLERANCE)) {
    return 0n;
  }

  const angle_work = angle * work.guard_scale;
  const result =
    reduced.sign * cos_series(angle_work, work.scale, work.max_iterations);
  return from_work_scale(result, work.guard_scale);
}
