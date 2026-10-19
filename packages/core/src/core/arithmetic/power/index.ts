import { power_by_squaring } from "../internal/power_by_squaring";

export function power(value: bigint, exp: number, scale: bigint): bigint {
  if (!Number.isInteger(exp)) throw new Error("Exponent must be an integer");
  if (exp === 0) return scale;

  if (value === 0n) {
    if (exp < 0) throw new Error("0 ** negative is undefined");
    return 0n;
  }

  if (exp < 0) {
    const reciprocal = (scale * scale) / value;
    return power_positive(reciprocal, -exp, scale);
  }

  return power_positive(value, exp, scale);
}

function power_positive(value: bigint, absExp: number, scale: bigint): bigint {
  if (absExp === 1) {
    return value;
  }
  if (absExp === 2) {
    return (value * value) / scale;
  }
  if (absExp === 3) {
    return (((value * value) / scale) * value) / scale;
  }
  return power_by_squaring(value, absExp, scale);
}
