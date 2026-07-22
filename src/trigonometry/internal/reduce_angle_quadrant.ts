import type { Work_Context } from "./work_context";

type Reduced_Angle = {
  angle: bigint;
  cos_sign: 1n | -1n;
  sin_sign: 1n | -1n;
};

export function reduce_angle_quadrant(
  value: bigint,
  work: Work_Context,
): Reduced_Angle {
  const pi = work.pi / work.guard_scale;
  const two_pi = work.two_pi / work.guard_scale;
  const half_pi = work.half_pi / work.guard_scale;
  let angle = value % two_pi;

  if (angle < 0n) {
    angle += two_pi;
  }

  if (angle <= half_pi) {
    return {
      angle: angle,
      cos_sign: 1n,
      sin_sign: 1n,
    };
  } else if (angle <= pi) {
    return {
      angle: pi - angle,
      cos_sign: -1n,
      sin_sign: 1n,
    };
  } else if (angle <= two_pi - half_pi) {
    return {
      angle: angle - pi,
      cos_sign: -1n,
      sin_sign: -1n,
    };
  } else {
    return {
      angle: two_pi - angle,
      cos_sign: 1n,
      sin_sign: -1n,
    };
  }
}
