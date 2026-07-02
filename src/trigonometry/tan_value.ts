import type { FPContext } from "../FixedPrecision";
import { assert_non_zero } from "./internal/assert_non_zero";
import { PI } from "./internal/constants";
import { cos_work } from "./internal/cos_series";
import { reduce_angle } from "./internal/reduce_angle";
import { scaled_decimal } from "./internal/scaled_decimal";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_work } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function tan_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const pi_half = scaled_decimal(PI, ctx.SCALE) >> 1n;

  if (value % pi_half === 0n && (value / pi_half) % 2n !== 0n) {
    throw new Error("Tangent is undefined when cosine is zero");
  }

  const reduced = reduce_angle(to_work_scale(value), work);
  const cosine = reduced.cos_sign * cos_work(reduced.angle, work.scale);

  assert_non_zero(cosine, "Tangent is undefined when cosine is zero");

  const sine = sin_work(reduced.angle, work.scale);
  return from_work_scale((sine * work.scale) / cosine);
}
