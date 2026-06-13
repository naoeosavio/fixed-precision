import type { FPContext } from "../FixedPrecision";
import { assert_between_minus_one_and_one } from "./internal/assert_between";
import { atan2_work } from "./internal/atan2_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sqrt_one_minus_squared } from "./internal/sqrt_one_minus_squared";
import { get_work_context } from "./internal/work_context";

export function asin_value(value: bigint, ctx: FPContext): bigint {
  assert_between_minus_one_and_one(value, ctx, "Arcsine");

  const work = get_work_context(ctx);
  const input = to_work_scale(value);
  const companion = sqrt_one_minus_squared(input, work.scale);
  return from_work_scale(atan2_work(input, companion, work));
}
