type Reduced_Angle = {
  angle: bigint;
  sign: 1n | -1n;
};

export function reduce_angle_quadrant_cos(
  value: bigint,
  work: bigint,
  is_cos: boolean,
): Reduced_Angle {
  const pi = work;
  const two_pi = pi << 1n;
  const half_pi = pi >> 1n;
  let angle = value % two_pi;

  if (angle < 0n) {
    angle += two_pi;
  }

  if (angle <= half_pi) {
    return {
      angle: is_cos ? angle : half_pi - angle,
      sign: 1n,
    };
  } else if (angle <= pi) {
    return {
      angle: is_cos ? pi - angle : angle - half_pi,
      sign: is_cos ? -1n : 1n,
    };
  } else if (angle <= pi + half_pi) {
    return {
      angle: is_cos ? angle - pi : pi - angle + half_pi,
      sign: -1n,
    };
  } else {
    return {
      angle: is_cos ? two_pi - angle : angle - (pi + half_pi),
      sign: is_cos ? 1n : -1n,
    };
  }
}
