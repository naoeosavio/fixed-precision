import type { FPContext } from "../FixedPrecision";
import { PI } from "./internal/constants";
import { assert_non_zero } from "./internal/assert_non_zero";
import { cos_work } from "./internal/cos_series";
import { reduce_angle } from "./internal/reduce_angle";
import { scaled_decimal } from "./internal/scaled_decimal";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_work } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function cot_value(value: bigint, ctx: FPContext): bigint {
  const pi_original = scaled_decimal(PI, ctx.SCALE);

  if (value % pi_original === 0n) {
    throw new Error("Cotangent is undefined when sine is zero");
  }

  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value), work);
  const sine = sin_work(reduced.angle, work.scale);

  assert_non_zero(sine, "Cotangent is undefined when sine is zero");

  const cosine = reduced.cos_sign * cos_work(reduced.angle, work.scale);
  return from_work_scale((cosine * work.scale) / sine);
}
