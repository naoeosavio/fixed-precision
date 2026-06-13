import type { Work_Context } from "./work_context";

export type Reduced_Angle = {
  angle: bigint;
  cos_sign: 1n | -1n;
};

export function reduce_angle(value: bigint, work: Work_Context): Reduced_Angle {
  let angle = value % work.two_pi;

  if (angle > work.pi) {
    angle -= work.two_pi;
  } else if (angle < -work.pi) {
    angle += work.two_pi;
  }

  if (angle > work.half_pi) {
    return {
      angle: work.pi - angle,
      cos_sign: -1n,
    };
  }

  if (angle < -work.half_pi) {
    return {
      angle: -work.pi - angle,
      cos_sign: -1n,
    };
  }

  return {
    angle,
    cos_sign: 1n,
  };
}
