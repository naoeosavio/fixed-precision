import type { FPContext } from "../FixedPrecision";
import { convert_radianos } from "./internal/convert_radianos";
import { cos_series } from "./internal/cos_series";
import { reconvert_angle } from "./internal/reconvert_angle";
import { reduce_angle_quadrant_cos } from "./internal/reduce_angle_quadrant_cos";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function cos_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const weak_pi = from_work_scale(work.pi, work.guard_scale);
  const reduced = reduce_angle_quadrant_cos(value, weak_pi, true);
  if (reduced.angle === 0n || reduced.angle === weak_pi) {
    return ctx.SCALE * reduced.sign;
  }

  if (reduced.angle === weak_pi >> 1n) {
    return 0n;
  }
  const angle = to_work_scale(
    reconvert_angle(reduced.angle + 2n, ctx.SCALE, work.pi),
    work.guard_scale,
  );
  const radinos = convert_radianos(angle, work.pi, ctx.SCALE);

  const result =
    reduced.sign * cos_series(radinos, work.scale, work.max_iterations);
  return from_work_scale(result, work.guard_scale);
}
