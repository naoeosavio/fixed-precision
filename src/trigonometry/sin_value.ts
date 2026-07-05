import type { FPContext } from "../FixedPrecision";
import { clamp_unit } from "./internal/clamp_unit";
import { PI } from "./internal/constants";
import { sin_work } from "./internal/sin_series";

const GUARD = 2n;
const GUARD_SCALE = 10n ** GUARD;

export function sin_value(value: bigint, ctx: FPContext): bigint {
  const places = ctx.places;
  const workScale = ctx.SCALE * GUARD_SCALE;
  const maxIter = places * 4;

  const piDigits = PI.replace(".", "");
  const workDigits = places + Number(GUARD);
  const piRaw = BigInt(piDigits.slice(0, workDigits + 1));

  const piFP20 = BigInt(piDigits.slice(0, places + 1));
  const halfPiFP20 = piFP20 / 2n;
  const degApprox = ((value * 180n) + halfPiFP20) / piFP20;
  const xRaw = (degApprox * piRaw) / 180n;

  const twoPi = piRaw * 2n;
  const halfPi = piRaw / 2n;

  let angle = ((xRaw % twoPi) + twoPi) % twoPi;

  if (angle === 0n || angle === piRaw) {
    return 0n;
  }

  if (angle === halfPi) {
    return ctx.SCALE;
  }

  let sign = 1n;
  if (angle > piRaw + halfPi) {
    angle = twoPi - angle;
    sign = -1n;
  } else if (angle > piRaw) {
    angle = angle - piRaw;
    sign = -1n;
  } else if (angle > halfPi) {
    angle = piRaw - angle;
  }

  const rawSin = sin_work(angle, workScale, maxIter);
  const result = (sign * rawSin) / GUARD_SCALE;

  return clamp_unit(result, ctx.SCALE);
}
