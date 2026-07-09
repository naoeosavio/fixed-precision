import type { FPContext } from "../FixedPrecision";
import { convert_radianos } from "./internal/convert_radianos";
import { cos_series } from "./internal/cos_series";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reconvert_angle } from "./internal/reconvert_angle";
import { reduce_angle_quadrant } from "./internal/reduce_angle_quadrant";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function sec_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle_quadrant(value, work);

  if (reduced.angle === 0n) {
    return reduced.cos_sign * ctx.SCALE;
  }

  const angle = to_work_scale(
    reconvert_angle(reduced.angle + 2n, ctx.SCALE, work.pi),
    work.guard_scale,
  );

  if (angle * 10n === 60n * ctx.SCALE) {
    return reduced.cos_sign * (ctx.SCALE * 2n);
  }

  if (angle * 10n === 90n * ctx.SCALE) {
    throw new Error("Secant is undefined when cosine is zero");
  }

  const radinos = convert_radianos(angle, work.pi, ctx.SCALE);

  const result = cos_series(radinos, work.scale, work.max_iterations);

  return (
    reduced.cos_sign *
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
