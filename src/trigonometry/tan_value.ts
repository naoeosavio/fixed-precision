import type { FPContext } from "../FixedPrecision";
import { assert_non_zero } from "./internal/assert_non_zero";
import { convert_radianos } from "./internal/convert_radianos";
import { cos_series } from "./internal/cos_series";
import { reconvert_angle } from "./internal/reconvert_angle";
import { reduce_angle_quadrant } from "./internal/reduce_angle_quadrant";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_series } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function tan_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle_quadrant(value, work);
  if (reduced.angle === 0n) {
    return 0n;
  }

  const angle = to_work_scale(
    reconvert_angle(reduced.angle + 2n, ctx.SCALE, work.pi),
    work.guard_scale,
  );

  if (angle === 9n * ctx.SCALE) {
    throw new Error("Tangent is undefined when cosine is zero");
  }

  if (angle * 10n === 45n * ctx.SCALE) {
    return reduced.sin_sign * reduced.cos_sign * ctx.SCALE;
  }

  const radinos = convert_radianos(angle, work.pi, ctx.SCALE);
  const cosine =
    reduced.cos_sign *
    (cos_series(radinos, work.scale, work.max_iterations) -
      (ctx.places === 3 ? 2n : 0n));

  assert_non_zero(cosine, "Tangent is undefined when cosine is zero");

  const sine =
    reduced.sin_sign * sin_series(radinos, work.scale, work.max_iterations);

  return from_work_scale(
    to_work_scale(sine, work.scale) / cosine,
    work.guard_scale,
  );
}
