import type { FPContext } from "../../../FixedPrecision";
import { assert_non_zero } from "../internal/assert_non_zero";
import { cos_series } from "../internal/cos_series";
import { is_near } from "../internal/is_near";
import { reduce_angle_quadrant } from "../internal/reduce_angle_quadrant";
import { from_work_scale, to_work_scale } from "../internal/scale_utils";
import { sin_series } from "../internal/sin_series";
import { get_work_context } from "../internal/work_context";

const ANGLE_TOLERANCE = 1n;

export function cot_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle_quadrant(value, work);
  const angle = reduced.angle / work.reduction_unit;
  if (angle === 0n || is_near(angle, work.weak_pi, ANGLE_TOLERANCE)) {
    throw new Error("Cotangent is undefined when sine is zero");
  }

  if (is_near(angle, work.weak_pi >> 2n, ANGLE_TOLERANCE)) {
    return reduced.sin_sign * reduced.cos_sign * ctx.SCALE;
  }

  const angle_work = angle * work.guard_scale;
  const sine =
    reduced.sin_sign * sin_series(angle_work, work.scale, work.max_iterations);
  assert_non_zero(sine, "Cotangent is undefined when sine is zero");
  const cosine =
    reduced.cos_sign * cos_series(angle_work, work.scale, work.max_iterations);

  return from_work_scale(
    to_work_scale(cosine, work.scale) / sine,
    work.guard_scale,
  );
}
