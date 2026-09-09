import type { FPContext } from "../../construction/types";
import { divide_rounded } from "../internal/divide_rounded";
import { exp_guard } from "../internal/exp_guard";
import { exp_work } from "../internal/exp_work";
import { to_work_scale } from "../internal/scale_utils";
import { get_work_context } from "../internal/work_context";

export function exp_value(value: bigint, ctx: FPContext): bigint {
  const guard = exp_guard(value, ctx);
  const work = get_work_context(ctx, guard);
  return divide_rounded(exp_work(to_work_scale(value, guard), work), guard);
}
