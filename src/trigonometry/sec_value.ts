import type { FPContext } from "../FixedPrecision";
import { PI } from "./internal/constants";
import { cos_work } from "./internal/cos_series";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reduce_angle } from "./internal/reduce_angle";
import { scaled_decimal } from "./internal/scaled_decimal";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function sec_value(value: bigint, ctx: FPContext): bigint {
  const pi_half = scaled_decimal(PI, ctx.SCALE) >> 1n;

  if (value % pi_half === 0n && (value / pi_half) % 2n !== 0n) {
    throw new Error("Secant is undefined when cosine is zero");
  }

  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value), work);
  const cosine = reduced.cos_sign * cos_work(reduced.angle, work.scale);
  return from_work_scale(reciprocal_work(cosine, work.scale, "Secant"));
}
