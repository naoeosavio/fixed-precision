import { to_number_with_ctx } from "../../core/numeric/toNumber";
import { scale } from "../arithmetic/scale";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function toNumber(
  value: FixedPrecisionOperand,
  places?: number,
): number {
  if (places === undefined) {
    const ctx = resolveContext([value]);
    return to_number_with_ctx(toScaled(value, ctx), ctx);
  }

  return toNumber(scale(value, places));
}
