import type { FPContext } from "../FixedPrecision";
import { assert_non_zero } from "./internal/assert_non_zero";
import { convert_radianos } from "./internal/convert_radianos";
import { cos_series } from "./internal/cos_series";
import { reconvert_angle } from "./internal/reconvert_angle";
import { reduce_angle_quadrant } from "./internal/reduce_angle_quadrant";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_series } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function cot_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const weak_pi = from_work_scale(work.pi, work.guard_scale);
  const reduced = reduce_angle_quadrant(value, work);
  if (reduced.angle === 0n) {
    throw new Error("Cotangent is undefined when sine is zero");
  }

  if (reduced.angle === weak_pi) {
    throw new Error("Cotangent is undefined when sine is zero");
  }

  const angle = to_work_scale(
    reconvert_angle(reduced.angle + 2n, ctx.SCALE, work.pi),
    work.guard_scale,
  );

  if (angle === 45n * (ctx.SCALE / 10n)) {
    return reduced.sin_sign * reduced.cos_sign * ctx.SCALE;
  }

  const radinos = convert_radianos(angle, work.pi, ctx.SCALE);
  const sine =
    reduced.sin_sign * sin_series(radinos, work.scale, work.max_iterations);
  assert_non_zero(sine, "Cotangent is undefined when sine is zero");
  const cosine =
    reduced.cos_sign * cos_series(radinos, work.scale, work.max_iterations);

  return from_work_scale(
    to_work_scale(cosine, work.scale) / sine,
    work.guard_scale,
  );
}
