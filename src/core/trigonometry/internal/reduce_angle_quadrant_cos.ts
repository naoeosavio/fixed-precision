type Reduced_Angle = {
  angle: bigint;
  sign: 1n | -1n;
};

function reduce_quadrant_cos(
  angle: bigint,
  pi: bigint,
  half_pi: bigint,
  two_pi: bigint,
): Reduced_Angle {
  if (angle <= half_pi) return { angle, sign: 1n };
  if (angle <= pi) return { angle: pi - angle, sign: -1n };
  if (angle <= pi + half_pi) return { angle: angle - pi, sign: -1n };
  return { angle: two_pi - angle, sign: 1n };
}

function reduce_quadrant_sin(
  angle: bigint,
  pi: bigint,
  half_pi: bigint,
): Reduced_Angle {
  if (angle <= half_pi) return { angle: half_pi - angle, sign: 1n };
  if (angle <= pi) return { angle: angle - half_pi, sign: 1n };
  if (angle <= pi + half_pi) return { angle: pi - angle + half_pi, sign: -1n };
  return { angle: angle - (pi + half_pi), sign: -1n };
}

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

  return is_cos
    ? reduce_quadrant_cos(angle, pi, half_pi, two_pi)
    : reduce_quadrant_sin(angle, pi, half_pi);
}
