import { round_value } from "../../arithmetic/round";
import { scale_value } from "../../arithmetic/scale";
import { shifted_by_value } from "../../arithmetic/shiftedBy";
import { makeContext } from "../../construction";
import type { FPContext, RoundingMode } from "../../construction/types";
import { to_string_with_ctx } from "../toString";

function to_fixed_raw(
  value: bigint,
  ctx: FPContext,
  places: number,
  rm: RoundingMode,
): string {
  const target = makeContext(places, rm);
  return to_string_with_ctx(scale_value(value, places, rm, ctx), target, false);
}

export function to_exponential_with_ctx(
  value: bigint,
  ctx: FPContext,
  dp?: number,
  rm?: RoundingMode,
): string {
  const effDp = dp ?? ctx.places;
  const mode = rm ?? ctx.roundingMode;
  const raw = value;

  if (raw === 0n) {
    return effDp === 0 ? "0e+0" : `0.${"0".repeat(effDp)}e+0`;
  }

  const negative = raw < 0n;
  const absRaw = negative ? -raw : raw;
  const digits = absRaw.toString();
  const padded = digits.padStart(ctx.places + 1, "0");
  const decimalPos = padded.length - ctx.places - 1;
  let firstSignificant = 0;
  while (padded[firstSignificant] === "0") {
    firstSignificant += 1;
  }
  const exp = decimalPos - firstSignificant;

  let mantissa = shifted_by_value(negative ? -absRaw : absRaw, -exp);
  if (effDp <= ctx.places) {
    mantissa = round_value(mantissa, effDp, mode, ctx);
  }

  const ten = 10n * BigInt(10) ** BigInt(ctx.places);
  if (mantissa >= ten || mantissa <= -ten) {
    mantissa = shifted_by_value(mantissa, -1);
    return `${to_fixed_raw(mantissa, ctx, effDp, mode)}e+${exp + 1}`;
  }

  return `${to_fixed_raw(mantissa, ctx, effDp, mode)}e${
    exp >= 0 ? "+" : ""
  }${exp}`;
}
