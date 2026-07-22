import type { FPContext } from "../FixedPrecision";
import { convert_radianos } from "./internal/convert_radianos";
import { cos_series } from "./internal/cos_series";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reconvert_angle } from "./internal/reconvert_angle";
import { reduce_angle_quadrant_cos } from "./internal/reduce_angle_quadrant_cos";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function csc_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const weak_pi = from_work_scale(work.pi, work.guard_scale);
  const reduced = reduce_angle_quadrant_cos(value, weak_pi, false);

  if (reduced.angle === 0n) {
    return reduced.sign * ctx.SCALE;
  }

  const angle = to_work_scale(
    reconvert_angle(reduced.angle + 2n, ctx.SCALE, work.pi),
    work.guard_scale,
  );

  if (angle * 10n === 90n * ctx.SCALE) {
    throw new Error("Cosecant is undefined when sine is zero");
  }

  if (angle * 10n === 60n * ctx.SCALE) {
    return reduced.sign * (ctx.SCALE * 2n);
  }

  const radinos = convert_radianos(angle, work.pi, ctx.SCALE);

  const result = cos_series(radinos, work.scale, work.max_iterations);
  return (
    reduced.sign *
    from_work_scale(
      reciprocal_work(
        result - (ctx.places === 13 || ctx.places === 18 ? 0n : 2n),
        work.scale,
        "Secant",
      ),
      work.guard_scale,
    )
  );
}
